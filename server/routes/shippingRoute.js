const express = require("express");
const router = express.Router();
const shipping = require("../models/shipping.model");

//get all shipping
router.get("/",async(req,res)=>{
    try{
        const shippings=await shipping.find();    
    res.json(shippings);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}
);
//get shipping by id
router.get("/:id",async(req,res)=>{
    try{
        const shippings=await shipping.findById(req.params.id);
        if(!shippings) return res.status(404).json({ message: "Shipping not found" });
        res.json(shippings);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

//create shipping
router.post("/",async(req,res)=>{   
    try{
        const newShipping = new shipping(req.body); 

        const savedShipping = await newShipping.save();
        res.status(201).json(savedShipping);
    }   

catch (err) {
        res.status(400).json({ message: err.message });
    }       

});
//update shipping
router.put("/:id",async(req,res)=>{     

    try{
        const updatedShipping = await shipping.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedShipping);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);
//delete shipping
router.delete("/:id",async(req,res)=>{  

    try{
        await shipping.findByIdAndDelete(req.params.id);
        res.json({ message: "Shipping deleted" });
    }   catch (err) {
        res.status(500).json({ message: err.message });
    }       

});
module.exports = router;