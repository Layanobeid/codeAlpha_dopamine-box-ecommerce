const express = require("express");
const router = express.Router();
const payment=require("../models/payment.model");
//get all payments
router.get("/",async(req,res)=>{
    try{
        const payments=await payment.find();    
    res.json(payments);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }   
});
//get payment by id
router.get("/:id",async(req,res)=>{
    try{
        const payments=await payment.findById(req.params.id);
        if(!payments) return res.status(404).json({ message: "Payment not found" });
        res.json(payments);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }   
});
//create payment
router.post("/",async(req,res)=>{   
    try{
        const newPayment = new payment(req.body);       
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    }   catch (err) {
        res.status(400).json({ message: err.message });
    }           
});
//update payment
router.put("/:id",async(req,res)=>{
    try{
        const updatedPayment = await payment.findByIdAndUpdate(
            req.params.id,  
            req.body,       
            { new: true }
        );
        res.json(updatedPayment);
    } catch (err) {         
        res.status(400).json({ message: err.message });
    }       
});
//delete payment
router.delete("/:id",async(req,res)=>{
    try{
        await payment.findByIdAndDelete(req.params.id); 
        res.json({ message: "Payment deleted" });   
    } catch (err) {
        res.status(500).json({ message: err.message });
    }       
});
module.exports = router;
