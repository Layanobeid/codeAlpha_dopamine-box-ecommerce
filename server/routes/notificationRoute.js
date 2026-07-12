const express = require("express");
const router = express.Router();
const notification = require("../models/notification.model");
//get all notifications
router.get("/", async (req, res) => {
  try { 
    const notifications = await notification.find();
    res.json(notifications);
    } catch (err) { 
        res.status(500).json({ message: err.message });
    }   
});
//get notification by id
router.get("/:id", async (req, res) => {
    try {
        const notifications = await notification.findById(req.params.id);   

        if (!notifications) return res.status(404).json({ message: "Notification not found" });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }       
});
//create notification
router.post("/", async (req, res) => {  
try{
    const newNotification = new notification(req.body);
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }       
});
//update notification
router.put("/:id", async (req, res) => {    
    try {
        const updatedNotification = await notification.findByIdAndUpdate(
            req.params.id,  
            req.body,
            { new: true }
        );
        res.json(updatedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//delete notification
router.delete("/:id", async (req, res) => {  
    try {
        await notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }       
});
module.exports = router;    
