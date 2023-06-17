import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";


import SendIcon from "../assets/icons/SendIcon";
import Avatar from "../components/Avatar";
import Logo from "../components/Logo";
import ArrowIcon from "../assets/icons/ArrowIcon";
import { uniqBy } from 'lodash'
import axios from "axios";
import Contact from "../components/Contact";
import UserIcon from "../assets/icons/UserIcon";
import FileIcon from "../assets/icons/FileIcon";

const Chat = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const [userMessage, setUserMessage] = useState("");
    const [sentMessages, setSentMessages] = useState([])
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({})
    const [selectedContact, setSelectedContact] = useState(null)
    const messageScroll = useRef(null)
    const [offlinePeople, setOfflinePeople] = useState({})
    const [pic, setPic] = useState('')

    
    useEffect(() => {
        //if (!user) return navigate("/");
        connectToWs()
        
    }, []);

    
    const connectToWs = () => {
        const ws = new WebSocket("ws://localhost:8080");
        setWs(ws);
        ws.addEventListener("message", handleMessageReceived)//esta ejecuta y cada renderizado
        ws.addEventListener("close", () => {
            setTimeout(() => {
                console.log('tratando de reconectar...')
                connectToWs()
            }, 1000);
        })//si se pierde la conexion (ya sea por reiniico del servidor o por internet o cualquier problema de coneccion) el web socket arroja el evento 'close' y si el front recibe y escucha ese evento, se vuelve a ejecutar la funcion de coneccion al websocket
    }                         //esta cada vez que retorne el evento close por eso el () =>
    
    useEffect(() => {
        if(selectedContact){

            axios.get("/message/messages/"+selectedContact)
                .then(({data}) => setSentMessages(data))
                    .catch(err => console.log(err))
        }
    }, [selectedContact])

    


    const showOnlinePeople = (peopleArray) => {
        //const peopleOnline = peopleArray.filter(person => person._id !== user._id)
        //console.log(peopleOnline)
        const peopleOnline = {}
        peopleArray.forEach(({_id, name}) => {
            peopleOnline[_id] = name
        })
        //console.log(peopleOnline)
        setOnlinePeople(peopleOnline)
    
    
    }
    
    
    const handleMessageReceived = (e) => {
        const messageData = JSON.parse(e.data)
        console.log(messageData)
        if('online' in messageData){
            showOnlinePeople(messageData.online)
        }else{
            
            setSentMessages(prev => ([...prev, {...messageData}]))
        }
    }

    
   const peopleOnlineWithOutMe = {...onlinePeople}
   
   delete peopleOnlineWithOutMe[user?._id]//daba null porque al recargar, el estado user del contexto se borra y debe hacer una peticion a la api pero al ser asincrona, el renderizado no espera por la respuesta del server y por esp da NULL, pero nada que un Cuestion Mark no solucione 😎
    //console.log(peopleOnlineWithOutMe)
   
   
   
    
    const handleSendMessage = (e, file = null) => {
   console.log(file)
        if(e) e.preventDefault()

        ws.send(JSON.stringify({//enviar al servidor//send'd be 'emit' in Socket.io
                recipient: selectedContact,
                text: userMessage,
                file
        }))//primero se guarda aqui (con el file si es que existe)
         if (file){

            axios.get("/message/messages/"+selectedContact)
                .then(({data}) => setSentMessages(data))
                .catch(err => console.log(err))

        }//si existe el file, nos traemos ese file (el String) de la bd para asi pintarlo
        setUserMessage('')
        setSentMessages(prev => ([...prev, {text: userMessage, sender: user._id, recipient: selectedContact, _id: Date.now()} ]))//guardar en frontend
    
}




const sendFile = (file) => {
  /* const reader = new FileReader()
   reader.readAsDataURL(e.target.files[0])// lo carga como base64 (codificado para que el server pueda leerlo)
   reader.onload = () => */
    
   if(!file){
    alert("seleccione una imagen")
    return;  
}    
  const uploadPreset = "chat22"
  const cloudName = "qsxpjlh1299nbzv"    

if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'){
    //const instance = axios.create()
    //const foto = file.toDataURL()
    const data = new FormData()
    console.log('entró aqui')
    data.append('file', file);
    data.append("upload_preset", 'chatapp');
    data.append('cloud_name', cloudName);
    

    fetch("https://api.cloudinary.com/v1_1/qsxpjlh1299nbzv/image/upload", {
        method: 'POST',
        
        body: data
    })
        .then((res) => res.json())
        .then((data) => {
            //setPic(data.url.toString())
            //handleSendMessage(null, data.url.toString())
            setPic(data.url.toString())
            handleSendMessage(null, data.url.toString())
        })    
        .catch (err => {
                console.log(err)
                
            })
}else {
    alert("por favor, seleccione una imagen")
     
      return;
}
   
       /* name: e.target.files[0].name,
        data: reader.result //resultado del readAsDataURL*)*/
   
   
}

 
useEffect(() => {
    const div = messageScroll.current;
    if (div) div.scrollIntoView({behavior: 'smooth', block: 'end'})
}, [sentMessages])


useEffect(() => {
    axios.get("/auth/people")
        .then(({data}) => {
            const offlinePeopleArr = data.filter(person => person._id !== user?._id)//luego del if, ya el usuario existe en el contexto
                .filter(person => !Object.keys(onlinePeople).includes(person._id))
                const offlinePeople = {}
                offlinePeopleArr.forEach((person) => {
                    offlinePeople[person._id] = person
                })
                setOfflinePeople(offlinePeople)
        })
}, [onlinePeople])



const messagesWithoutDupes = uniqBy(sentMessages, '_id') 




const logout = async () => {
    const res = await useFetch("/auth/logout", "POST", {})
    const data = await res.json()
    if(data) {
        setWs(null)
        setUser(null)
        return navigate('/')
    }
}





if(!user) return <div>cargando...</div>//HERMOSO, no muestra el body y solucionado!! 



    return (
        <div className="flex h-screen">
            <aside className="bg-blue-50 w-1/3 flex flex-col">
             
                <section className="flex-grow">
                <div className="bg-primary-blue pb-2 mb-4"><Logo /></div>
                    {Object.keys(peopleOnlineWithOutMe).map((_id) => (
                        <Contact 
                            key={_id}
                            _id={_id}
                            name={peopleOnlineWithOutMe[_id]}
                            onClick={() => setSelectedContact(_id)}
                            selected={_id === selectedContact}
                            online={true}
                        />
                    ))}

                    {Object.keys(offlinePeople).map((_id) => (
                        <Contact 
                            key={_id}
                            _id={_id}
                            name={offlinePeople[_id]?.name}
                            onClick={() => setSelectedContact(_id)}
                            selected={_id === selectedContact}
                            online={false}
                        />
                    ))}
                </section>

                <section className="border-2 border-primary-blue justify-between flex flex-[2fr_1fr] gap-2 items-center p-2 mb-2">
                <span className="text-sm shrink-0 flex items-center gap-2">
                    <UserIcon />
                    <p className="text-2xl">{user.name}</p>
                </span>
                    
                    <button className="shrink-0 text-sm font-bold bg-primary-blue text-blue-900 px-2 py-2 rounded-sm hover:bg-cyan-600 duration-700 hover:text-white border mb-1"
                            onClick={logout}
                    >
                        Cerrar sesión
                    </button>
                    
                </section>
            </aside>
            <aside className="flex flex-col bg-aside-blue w-2/3 p-3">
                <section className="flex-grow">
                    {!selectedContact && (
                        <article className="flex gap-2 items-center justify-center h-full">
                            <ArrowIcon />
                            <p className="text-blue-600 text-opacity-40 font-semibold text-center">seleccione un contacto para comenzar a chatear</p>
                        </article>
                    )}
                    {selectedContact && (//se muestra el mensaje con el contacto
                        <article className="relative h-full">
                            <div className="absolute overflow-y-scroll inset-0">
                            {messagesWithoutDupes.map(message => (
                                <div key={message._id} className={(message.sender === user._id ? "text-right" : "text-left")}>
                                    <p className={"text-left inline-block p-2 m-1 rounded-sm text-sm " + (message.sender === user._id ? "bg-blue-500 text-white" : "bg-white text-gray-800")}>
                                    {message.text} 
                                    {message.file && (
                                        <img src={message.file} alt="" className="w-72 h-56 object-cover"/>
                                    )}
                                    </p>
                                </div>
                                ))}
                                <div ref={messageScroll} ></div>
                            </div>
                        </article>
                    )}
                </section>
                {!!selectedContact && (//dependiendo de si esta vacio o no, lo convierte a booleano, es true muestra el form

                    <form className="flex gap-2 h-16" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="escribe tu mensaje"
                            className="bg-blue-50 mt-4 mb-2 p-2 rounded-sm flex-grow border border-gray-400 border-opacity-70"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                        />

                        <label
                            
                            className="bg-blue-200 hover:bg-hover-blue h-10 mt-4 duration-500 border border-gray-300 flex items-center cursor-pointer"
                            title="Insertar archivo"
                        >
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => sendFile(e.target.files[0])}/>
                            <FileIcon />
                        </label>
                        
                        <button
                            className={`${
                                userMessage &&
                                "h-10 mt-4 items-center flex bg-primary-blue text-blue-900 border border-primary-blue rounded-sm hover:bg-cyan-600 duration-500"
                            }`}
                            title="enviar mensaje"
                            type="submit"
                        >
                            {userMessage.length > 0 && (
                                <figure className="mt-4 mb-2">
                                    <SendIcon />
                                </figure>
                            )}
                        </button>
                    </form>
                )}
            </aside>
        </div>
    );
};

export default Chat;
