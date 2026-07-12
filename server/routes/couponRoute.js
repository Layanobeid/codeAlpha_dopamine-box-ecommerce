const express = require("express");
const router = express.Router();
const coupon = require("../models/coupon.model");
//get all coupons
router.get("/",async(req,res)=>{
    try{
        const coupons=await coupon.find();    
    res.json(coupons);
    }   
    catch(err){
        res.status(500).json({ message: err.message });
    }   
});
//get coupon by id
router.get("/:id",async(req,res)=>{
    try{
        const coupons=await coupon.findById(req.params.id); 
        if(!coupons) return res.status(404).json({ message: "Coupon not found" });
        res.json(coupons);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }   
});
//create coupon
router.post("/",async(req,res)=>{
    try{
        const newCoupon = new coupon(req.body);       
        const savedCoupon = await newCoupon.save();
        res.status(201).json(savedCoupon);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }

});

//update coupon
router.put("/:id",async(req,res)=>{
    try{
        const updatedCoupon = await coupon.findByIdAndUpdate(
            req.params.id,  
            req.body,   
            { new: true }
        );
        res.json(updatedCoupon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }       
}); 
//delete coupon
router.delete("/:id",async(req,res)=>{
    try{
        await coupon.findByIdAndDelete(req.params.id); 
        res.json({ message: "Coupon deleted" });   
    }   
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;