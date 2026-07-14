import { Webhook } from "svix";
// import UserModel from "../models/user.js";
// import PurchaseModel from '../models/purchase.js';
// import CourseModel from '../models/course.js'
import prisma from "../config/prisma.js";
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
   // console.log('Clerk webhook event:', event.type);
    // log event data lightly for debugging (avoid PII in production)
    //console.log('Clerk webhook data keys:', Object.keys(event.data || {}));
    const { type, data } = event;

    switch (type) {
      case "user.created":
        // await UserModel.create({
        //   id: data.id,
        //   name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        //   email: data.email_addresses[0]?.email_address,
        //   imgUrl: data.image_url || "",
        // });
        await prisma.user.create({
          data: {
            id: data.id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0]?.email_address,
            imgUrl: data.image_url || "",
          }
        });
       
        break;

      case "user.updated":
        // await UserModel.findOneAndUpdate(
        //   { id: data.id },
        //   {
        //     name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        //     email: data.email_addresses[0]?.email_address,
        //     imgUrl: data.image_url || "",
        //   }
        // );
        await prisma.user.update({
          where: { id: data.id },
          data: {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0]?.email_address,
            imgUrl: data.image_url || "",
          }
        });
        break;

      case "user.deleted":
        // await UserModel.findOneAndDelete({ id: data.id });
        await prisma.user.delete({
          where: { id: data.id }
        });
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



export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).send(`webhook error:${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const payment_intent = event.data.object;
      const payment_intentId = payment_intent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: payment_intentId
      })

      const { purchaseId } = session.data[0].metadata;

      // const purchaseData = await PurchaseModel.findById(purchaseId);
      // const userData = await UserModel.findOne({id:purchaseData.userId});
      // const courseData = await CourseModel.findById(purchaseData.courseId.toString())
      //
      // courseData.enrolledStudents.push(userData._id)
      // // courseData.enrolledStudents.push(userData.id)
      // await courseData.save()
      //
      // userData.enrolledCourses.push(courseData._id)
      // await userData.save()
      // purchaseData.status = 'completed'
      // await purchaseData.save()

      await prisma.$transaction(async (tx) => {
        const purchaseData = await tx.purchase.findUnique({
          where: { id: purchaseId }
        });
        if (!purchaseData) {
          throw new Error("Purchase not found");
        }

        const userData = await tx.user.findUnique({
          where: { id: purchaseData.userId }
        });
        if (!userData) {
          throw new Error("User not found");
        }

        // Connect user to course to enroll them (updates both ends of implicit relation)
        await tx.user.update({
          where: { id: userData.id },
          data: {
            enrolledCourses: {
              connect: { id: purchaseData.courseId }
            }
          }
        });

        // Set status to completed
        await tx.purchase.update({
          where: { id: purchaseId },
          data: { status: "completed" }
        });
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      const payment_intent = event.data.object;
      const payment_intentId = payment_intent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: payment_intentId
      })

      const { purchaseId } = session.data[0].metadata;
      // const purchaseData = await PurchaseModel.findById(purchaseId);
      // purchaseData.status = 'failed'
      // purchaseData.save()
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: "failed" }
      });
      break;
    }
    default:
      console.log(`unhandled event type${event.type}`);

  }
  res.json({ received: true });
}
