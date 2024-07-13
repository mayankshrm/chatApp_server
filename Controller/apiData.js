import user from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import conversation from "../model/conversation.js";
import message from "../model/message.js";


export const getUser=async(req,res)=>{
try {    
    const users=await user.find();
    res.status(200).json(users);
} catch (error) {
    res.status(400).json({message:error.message})
}
}


export  const getSingleUSer=async(req,res)=>{
try {
    const id=req.query.userId
    const single=await user.findById(id);
    res.status(200).json(single)
} catch (error) {
    res.status(400).json({message:error.message})
}
}

export const postUser=async(req,res)=>{
    try {
        const data=req.body;
        const password=data.password;
        const email=data.email;
        
        const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
        
       const newUser= new user({
        email:email,
        password:hashedPassword
       })

        await newUser.save();
        console.log("user saved in DB");
       
    } catch (error) {
        console.log(error);
    }
}


export const loginUser=async(req,res)=>{
    try {
       const data=req.body;
        const email=data.email;
        const password=data.password;
        let user1=await user.findOne({email:email});
            const isPass=await bcrypt.compare(password,user1.password);
        if(user1){
        if(user1.email==email && isPass){
            var token = jwt.sign({email:user1.email}, 'jwtSecret',{
                expiresIn:"2d"
            });
        res.status(200).json({success:true,token,user1})
        }
        else{
            res.status(200).json({success:false,error:"password is wrong"})
        }
    }else{
        res.status(200).json({success:false,error:"no user found"})
    }

        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
    }

    export const conversationU= async(req,res)=>{
            const newConversation =new conversation({
                members:[req.body.senderId,req.body.receiverId]
            }) 

            try {
                const savedCon=await newConversation.save();
                res.status(200).json(savedCon);

            } catch (error) {
                res.status(500).json(err);
            }
    }

   export const getConversation=async(req,res)=>{
         try {
          const conversationU = await conversation.find({
            members: { $in: [req.params.userId] },
          });
          res.status(200).json(conversationU);
        } catch (err) {
          res.status(500).json(err);
        }
      
   }


   export const postMessage=async(req,res)=>{
       
       const newMessage=new message({
           conversationId:req.body.conversationId,
           senderId:req.body.senderId,
           text:req.body.text
        })
    try {
        const savedMessage= await newMessage.save();
     res.status(200).json(savedMessage);
   } catch (err) {
     res.status(500).json(err);
   }
 
}


export const getMessage=async(req,res)=>{
    try {
     const message1 = await message.find({
       
conversationId:req.params.conversationId,
     });
     res.status(200).json(message1);
   } catch (err) {
     res.status(500).json(err);
   }
 
}