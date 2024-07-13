import express from "express";

import {  conversationU, getConversation, getMessage, getSingleUSer, getUser,loginUser,postMessage,postUser } from "../Controller/apiData.js";



const router=express.Router();


router.get("/user",getUser)
router.get("/singleuser",getSingleUSer)
router.post("/userdata",postUser)
router.post("/login",loginUser)
router.post("/conversation",conversationU)
router.get("/conversation/:userId",getConversation)
router.post("/messages",postMessage)
router.get("/messages/:conversationId",getMessage)


export default router;