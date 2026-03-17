import express from "express";
import { userAuth } from '../middlewares/auth.js';
import { ValidatedEditData, ValidatedPassword} from '../utils/validation.js';
import bcrypt from 'bcrypt';

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try{
    const user = req.user;
    res.send(user);
  } catch(err){
    res.status(404).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!ValidatedEditData(req)){
            throw new Error("Invalid edit data");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.send({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        });
    } catch(err){
        return res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        if(!ValidatedPassword(req)){
            throw new Error("Enter a valid and strong password");
        }
        const loggedInUser = req.user;
        loggedInUser.password = await bcrypt.hash(req.body.password, 10);
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your password updated successfully`);
    } catch (err){
        return res.status(400).send("ERROR : " + err.message);
    }
});

export default profileRouter;   