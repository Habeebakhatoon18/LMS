

import { Webhook } from "svix";
import UserModel from "../models/user.js";

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

export default clerkWebhook;
