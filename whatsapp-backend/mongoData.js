import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            name: String,
            timestamp: String,
            received: Boolean,
        }
    ]
});

export default mongoose.model("conversations", whatsappSchema);
