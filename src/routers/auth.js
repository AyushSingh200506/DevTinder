import express from 'express';
import bcrypt from 'bcrypt';
import { ValidatedData } from '../utils/validation.js';
import User from '../models/user.js';

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    ValidatedData(req);
    const { firstName, lastName, emailID, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: hashedPassword
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(500).send("Error signing up user" + " " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailID, password } = req.body;
  try {
    const user = await User.findOne({ emailID });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(404).send("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000)});
      res.send("User logged in successfully");
    }
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.send("User logged out successfully");
});

export default authRouter;