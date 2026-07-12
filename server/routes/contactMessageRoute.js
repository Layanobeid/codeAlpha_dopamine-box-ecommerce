const express = require("express");
const router = express.Router();
const contactMessage = require("../models/Message.model");
//get all contact messages
router.get("/",async(req,res)=>{
    try{
        const contactMessages=await contactMessage.find();
        res.json(contactMessages);
    }   catch(err){
        res.status(500).json({ message: err.message });
    }       
}); 
//get contact message by id
router.get("/:id",async(req,res)=>{
    try{
        const contactMessages=await contactMessage.findById(req.params.id);
        if(!contactMessages) return res.status(404).json({ message: "Contact message not found" });
        res.json(contactMessages);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }       
});
//create contact message
router.post("/",async(req,res)=>{
    try{
        const newContactMessage = new contactMessage(req.body);             
        const savedContactMessage = await newContactMessage.save();
        res.status(201).json(savedContactMessage);
    }   catch (err) {
        res.status(400).json({ message: err.message });
    }
}); 
//update contact message
router.put("/:id",async(req,res)=>{
    try{
        const updatedContactMessage = await contactMessage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedContactMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }       
});
//delete contact message
router.delete("/:id",async(req,res)=>{
    try{    
        await contactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact message deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }   
});
module.exports = router;