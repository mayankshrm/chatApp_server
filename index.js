import express from "express"
import mongoose from "mongoose";
import apiRoutes from "../server/Routes/api.js"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import { Server } from "socket.io";
import cors from "cors";
import { createServer } from 'node:http';
import user from "./model/user.js";

const app=express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
});
dotenv.config()
app.use(express.json());
app.use(bodyParser.json({limit:"30mb" ,extended: "true"}));
app.use(bodyParser.urlencoded({limit:"30mb" ,extended: "true"}));
app.use(cors());

app.use("/api",apiRoutes);

let users=[];


const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId===userId) &&
    users.push({userId,socketId})
}

const remove=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId )
}

const getUser = (userId) => {
    console.log(userId)
    console.log(users)
  return users.find((user) => user.userId === userId);
};


io.on('connection', (socket) => {
    console.log('a user connected'+ socket.id);

    socket.on("addUser",userId=>{
            addUser(userId,socket.id);
            io.emit("getUsers",users)
           
    })

    socket.on("message",({senderId,receiverId,text})=>{
        
        const user=getUser(receiverId);
        //console.log(user.socketId+" "+senderId+" "+text+" "+receiverId)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text
        })
    })

    socket.on("disconnect",()=>{
        
        console.log("a user disconnect");
        remove(socket.id);
        io.emit("getUsers",users)
    })
  });



const CONNECT_URL=process.env.MONGO_URL;

mongoose.connect(CONNECT_URL)
.then(()=>server.listen(1234,()=>console.log("connect succesful")))
.catch((error)=>{console.log(error.message)});
