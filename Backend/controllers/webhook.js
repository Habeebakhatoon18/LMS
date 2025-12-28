import { Webhook } from "svix";
import UserModel from "../models/user.js";

export const clerkWebhook = async (req, res) => {
    const whook = new Webhook(process.env.SVIX_SIGNING_SECRET);

    await whook.verify(JSON.stringify(req.body),{
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature']
    });

    const {data, type } = req.body;

    switch (type) {
        case "user.created":
            await UserModel.create({
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                imgUrl: data.imgUrl || ""
            });
            res.json({ message: "User created successfully" });
            break;
        case "user.updated":
            await UserModel.findOneAndUpdate(
                { id: data.id },
                {
                    name: data.name,
                    email: data.email,
                    imgUrl: data.imgUrl || ""
                }
            );
            res.json({ message: "User updated successfully" });
            break;
        case "user.deleted":
            await UserModel.findOneAndDelete({ id: data.id });
            res.json({ message: "User deleted successfully" });
            break;
        default:
            console.log("Unknown webhook type");
    }
};
export default clerkWebhook;