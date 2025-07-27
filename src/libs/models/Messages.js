import mongoose, {Schema, models} from "mongoose"

const messageSchema = new Schema({
    fullname:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    marked:{
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

const MessageModel = models.MessageModel || mongoose.model("MessageModel" , messageSchema);
export default MessageModel;