import express from "express";
import { userAuth } from '../middlewares/auth.js';
import ConnectionRequestModel from "../models/connectionRequest.js";
import User from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:UserId", userAuth, async (req, res) => {
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.UserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid status type: " + status
      });
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Connection request already exists"
      });
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();
    const message =
      status === "interested"
      ? "You are interested in " + toUser.firstName + "'s profile"
      : "You have ignored " + toUser.firstName + "'s profile";
    res.json({ message, data });
  }  
  catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const { status, requestId} = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid status type!!"
      });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });
    if(!connectionRequest){
      return res.status(400).json({
        message: "Connection request not found"
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: "You have " + status + " the connection request",
      data
    });

  } catch(err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

export default requestRouter;