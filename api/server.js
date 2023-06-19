import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import "./db/connectMongo.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
//import { Buffer } from 'node:buffer';

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs';

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from './routes/messageRoutes.js'

import User from "./models/userModel.js";
import Message from "./models/messageModel.js";

const app = express();
app.use(
    cors({
        credentials: true,
        origin: "https://chat-mern-ws.netlify.app",
    })
);

app.use(express.json());
//app.use(express.urlencoded({ extended: true })); esto es para peticiones directas por el action del form en html o jsx
app.use(cookieParser());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(__dirname + '/uploads'))


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes)

app.get("/", (req, res) => {
    res.send("hola desde node js");
});
//hLPvqu66GncwtR03
const server = app.listen(8080, () =>
    console.log("conectado al puerto http://localhost:8080")
);

const wsServer = new WebSocketServer({ server }, {
    cors: {
        origin: "https://chat-mern-ws.netlify.app"
    }
}
   
);

wsServer.on("connection", async(connection, req) => {
    
    function notifyAboutOnlinePeople() {
        

         //notifica cuando un suaurio se conecta
        [...wsServer.clients].forEach(client => {//iteramos el array por cada cliente
            client.send(JSON.stringify({//por cada elemento (cliente) parseamos los datos a json para enviarlos a la cola y luego recibirlos en el front
            online:  [...wsServer.clients].map(cli => ({_id:cli._id, name: cli.name}))
            }//devolvemos un nuevo array por cada cliente, parseado ya a json
                
            ))
        })

    }
    
    
    
    //verificar si la conexion esta viva
    connection.isAlive = true
    
    connection.timer = setInterval(() => {
        connection.ping(); //se envia un mensaje ping al cliente a treves del websockect
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer)
            connection.terminate()
            notifyAboutOnlinePeople()
            console.log('dead connection')
        }, 1000);
    }, 5000);


    connection.on("pong", () => {//escuchador para el cliente:  devuelve un pong si la conexion esta viva y asi el websocket no cierra la conexion
        clearTimeout(connection.deathTimer)
    })



    //lee la informacion del usuario mediante la cookie para esta coneccion
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenString = cookies.split("=")[1]; //find(str => str.startsWith(string)) //para iterar un array y encontrar un string
        if (tokenString) {
           try {
            const {uid}= jwt.verify(tokenString, process.env.JWT_SECRET, {} );
            const {_id, name} = await User.findById(uid).lean()
                connection._id = _id.toString()//soy un crack
                connection.name = name
           } catch (error) {
            console.log(error.message)
           }
        }
    }

    
    connection.on('message', async (message) => {//evanto message
        const messageData = JSON.parse(message.toString())
        const { recipient, text, file } = messageData
        console.log(file)
      // let filename = null
       /* if(file) {
            const {name, data} = file
            console.log(file)
            const extension = name.split('.').at(-1)//returns de last part of an array
            filename = Date.now() + '.' + extension
            const filePath = __dirname + '/uploads/' + filename;
            const bufferData = new Buffer.from(data.split(',')[1], 'base64')//lo decodificamos
            console.log(bufferData)
           
            fs.writeFile(filePath, bufferData, () => {
                console.log('archivo guardado: '+filePath)
            })
        }*/
        if(recipient && (text || file)) {
            
            const messageDoc = new Message({
                sender: connection._id,
                recipient,
                text,
                file: file ? file : null 
            })
            await messageDoc.save()
//

            try {
                [...wsServer.clients]
                .filter(client => client._id === recipient)//filtra cada instancia donde el cliente esté online
                    .forEach(c => c.send(JSON.stringify({
                        
                        text,
                        sender: connection._id.toString(),
                        recipient,
                        _id: messageDoc._id.toString(),
                        file: file ? file : null,//
                    
                    })))//
                   // console.log(algo)
            } catch (error) {
                console.log(error)
            }
        }
    })
    
    
   //notifica cuando un suaurio se conecta
   notifyAboutOnlinePeople()


   

}); //todo lo que se hace en la coneccion del wss con el servidor



//lo que se hara con la conexion cerrada
/*wsServer.on("close", data => {
    console.log('desconectado '+data)
})*/

