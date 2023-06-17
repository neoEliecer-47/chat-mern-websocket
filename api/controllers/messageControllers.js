import Message from "../models/messageModel.js"

export const getMessages = async (req, res) => {
    
    const {_id} = req.params //id del contacto que hemos seleccionado, con quien hemos estado habkando
    
    try {
        console.log(_id, req.uid)
        const messages = await Message.find({//find de mongoose, trabaja distinto a al find de los array.prototype, no confundir !!!

            sender: {$in: [_id, req.uid]},
            recipient: {$in: [_id, req.uid]}

        }).sort({createAt: 1})


        res.status(200).json(messages)

    } catch (error) {
        
    }
}