const express = require("express");
const router = express.Router();
const Review = require("../models/review.model");

//get all reviews
router.get("/", async (req, res) => {
    try{
        const reviews = await Review.find();
        res.json(reviews);

    }catch(err){
        res.status(500).json({ message: err.message });
    }   

   }
 );
 //get review by id
 router.get("/:id",async(req,res)=>{
    try{
        const reviews=await Review.findById(req.params.id);
        if(!reviews) return res.status(404).json({ message: "Review not found" });
        res.json(reviews);  
    }catch(err){
        res.status(500).json({ message: err.message });
    }

 });

 //create review
router.post("/",async(req,res)=>{
    try{
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    }catch (err) {
        res.status(400).json({ message: err.message });
    }   

});
//update review
router.put("/:id",async(req,res)=>{ 
    try{    
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReview);
    }       
    catch (err) {
        res.status(400).json({ message: err.message });
    }           
}); 

//delete review
router.delete("/:id",async(req,res)=>{
    try{        
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted" });
    }   
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});
module.exports = router;