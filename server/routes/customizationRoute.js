const express = require("express");
const router = express.Router();
const customization = require("../models/customization.model");

//get all customizations
router.get("/",async(req,res)=>{
    try{
        const customizations=await customization.find();    
    res.json(customizations);
    }   
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
//get customization by id
router.get("/:id",async(req,res)=>{
    try{    
        const customizations=await customization.findById(req.params.id);
        if(!customizations) return res.status(404).json({ message: "Customization not found" });
        res.json(customizations);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
//create customization
router.post("/",async(req,res)=>{
    try{
        const newCustomization = new customization(req.body);       
        const savedCustomization = await newCustomization.save();
        res.status(201).json(savedCustomization);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//update customization
router.put("/:id",async(req,res)=>{
    try{
        const updatedCustomization = await customization.findByIdAndUpdate(
            req.params.id,  
            req.body,
            { new: true }
        );
        res.json(updatedCustomization);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//delete customization
router.delete("/:id",async(req,res)=>{
    try{    
        await customization.findByIdAndDelete(req.params.id);
        res.json({ message: "Customization deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);
module.exports = router;