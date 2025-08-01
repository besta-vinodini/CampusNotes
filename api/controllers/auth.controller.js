import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const isAdmin = email === process.env.ADMIN_EMAIL;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
      admin: isAdmin,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .status(200)
        .json({
          success: true,
          message: "Successfully signed in as admin",
          user: {
            _id: "admin",
            username: "Admin",
            email: process.env.ADMIN_EMAIL,
            role: "admin",
          },
          tokenExpiration: "30d",
        });
    }

    // User login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "Successfully signed in",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar : user.avatar,
        createdAt : user.createdAt
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ ...rest, _id: user._id });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      let avatarUrl = "";
      try {
        const result = await cloudinary.uploader.upload(req.body.photo, {
          folder: "avatars",
          public_id: `google-${Date.now()}`,
        });
        avatarUrl = result.secure_url;
      } catch (err) {
        console.log("Cloudinary upload failed (dev mode):", err.message);
        avatarUrl = "https://dummyimage.com/300x300/ccc/000&text=User";
      }

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: avatarUrl,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ ...rest, _id: newUser._id });
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
