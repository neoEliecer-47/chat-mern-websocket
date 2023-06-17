import { Schema, model } from 'mongoose'


const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String
    },
    file: {
        type: String
    }
}, {timestamps: true})

const Message = model('message', messageSchema)
export default Message