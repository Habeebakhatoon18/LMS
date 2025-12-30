import stripe from 'stripe';
import { Webhook } from "svix";
import UserModel from "../models/user.js";
import PurchaseModel from '../models/purchase.js';
import CourseModel from '../models/course.js'
import stripeInstance from "../config/stripe.js";

export const clerkWebhook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = whook.verify(req.body, headers);
    console.log('Clerk webhook event:', event.type);
    // log event data lightly for debugging (avoid PII in production)
    console.log('Clerk webhook data keys:', Object.keys(event.data || {}));
    const { type, data } = event;

    switch (type) {
      case "user.created":
        await UserModel.create({
          id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0]?.email_address,
          imgUrl: data.image_url || "",
        });
        console.log('Saved user to MongoDB:', data.id);
        break;

      case "user.updated":
        await UserModel.findOneAndUpdate(
          { id: data.id },
          {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0]?.email_address,
            imgUrl: data.image_url || "",
          }
        );
        break;

      case "user.deleted":
        await UserModel.findOneAndDelete({ id: data.id });
        break;

      default:
        console.log("Unhandled Clerk webhook:", type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook verification failed" });
  }
};



// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;
//   try {
//     event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
//   } catch (err) {
//     res.status(400).send(`webhook error:${err.message}`);
//   }

//   switch (event.type) {
//     case 'payment_intent.succeeded': {
//       const payment_intent = event.data.object;
//       const payment_intentId = payment_intent.id;
//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: payment_intentId
//       })

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await PurchaseModel.findById(purchaseId);
//       const userData = await UserModel.findOne({id:purchaseData.userId});
//       const courseData = await CourseModel.findById(purchaseData.courseId.toString())

//       courseData.enrolledStudents.push(userData)
//       // courseData.enrolledStudents.push(userData.id)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()
//       purchaseData.status = 'completed'
//       await purchaseData.save()
//       break;
//     }
//     case 'payment_intent.payment_failed': {
//       const payment_intent = event.data.object;
//       const payment_intentId = payment_intent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: payment_intentId
//       })

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await PurchaseModel.findById(purchaseId);
//       purchaseData.status = 'failed'
//       purchaseData.save()
//       break;
//     }
//     default:
//       console.log(`unhandled event type${event.type}`);

//   }
//   res.json({ received: true });
// }
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { purchaseId } = session.metadata;

      if (!purchaseId) break;

      const purchaseData = await PurchaseModel.findById(purchaseId);
      if (!purchaseData) break;

      // 🔹 Find user using STRING id
      const userData = await UserModel.findOne({ id: purchaseData.userId });
      const courseData = await CourseModel.findById(purchaseData.courseId);

      if (!userData || !courseData) break;

      // 🔹 Update Course (expects STRING userId)
      if (!courseData.enrolledStudents.includes(userData.id)) {
        courseData.enrolledStudents.push(userData.id);
        await courseData.save();
      }

      // 🔹 Update User (expects ObjectId courseId)
      if (!userData.enrolledCourses.includes(courseData._id)) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      // 🔹 Update Purchase
      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: intent.id,
      });

      const purchaseId = sessions.data[0]?.metadata?.purchaseId;
      if (!purchaseId) break;

      await PurchaseModel.findByIdAndUpdate(purchaseId, {
        status: "failed",
      });

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
