import express from "express";
import {userAuth} from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import User from "../models/user.js";

const userRouter = express.Router();
const SAFE_USER_DATA = "firstName lastName age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_USER_DATA);

        res.json({
            message: "Received pending connection requests",
            data: receivedRequests
        });
    } catch(err){
        res.status(400).send("ERORR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", SAFE_USER_DATA).populate("toUserId", SAFE_USER_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            } else{
                return row.fromUserId;
            }
        });

        res.json({
            data,
        });
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 20 ? 20 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const feedUsers = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUserFromFeed) } }
            ]
        }).select(SAFE_USER_DATA).skip(skip).limit(limit);
        res.json({
            data: feedUsers
        });
    } catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})

export default userRouter;