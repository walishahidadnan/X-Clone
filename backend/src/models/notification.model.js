import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["like", "comment", "follow"],
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;