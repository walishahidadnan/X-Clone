import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
// import { populate } from "dotenv";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({createdAt: -1})
        .populate("user", "username firstName LastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName LastName profilePicture"
            }
        })
    res.send(200).json({posts});
});

export const getPost = asyncHandler(async (req, res) => {
    const {postId} = req.params;

    const post = await Post.findById(postID)
        .populate("user", "username firstName LastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName LastName profilePicture"
            }
        })

    if(!post) return res.status(404).json({error: "Post not found"});
        
    res.status(200).json({post});
});

export const getUserPosts = asyncHandler(async (req, res) => {
    const {username} = req.query;

    const user = await User.findOne({username});

    if(!user) return res.status(404).json({error: "User not found"});

    const posts = await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate("user", "username firstName LastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName LastName profilePicture"
            }
        });

    res.status(200).json({posts});
});

export const createPost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {content} = req.body;
    const imageFile =  req.file;

    if(!content || !imageFile) {
        return res.status(400).json({error: "Post must contain content and an image"});
    }

    const user = await User.findOne({clerkId: userId});
    if(!user) {
        return res.status(404).json({error: "User not found"});
    }

    let imageUrl = "";
    
    if(imageFile){
        try {
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: "social_media_posts",
            resource_type: "image",
            transformation: [
                {width: 800, height: 800, crop: "limit"},
                {quality: "auto"},
                {format: "auto"}
            ]
            });
            imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError)
            return res.status(500).json({error: "Image upload failed"});
        }
     }

     const post = await Post.create({
        user: user._id,
        content: content || "",
        image: imageUrl
     });

     res.status(201).json({post})
});

export const likePost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;

    const user = await User.findOne({clerkId: userId});
    const post = await Post.findById(postId);

    if(!user || !post) {
        return res.status(404).json({error: "User or Post not found"});
    }

    const isLiked = post.likes.includes(user._id);

    if(isLiked){
        await Post.findByIdAndUpdate(postId, {
            $pull: {likes: user._id},
        });
    } else {
        await Post.findByIdAndUpdate(postId, {
            $push: {likes: user._id},
        });
        if(post.user.toString() !== user._id.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                type: "like",
                post: postId
            });
        }
    }
    res.status(200).json({message: isLiked ? "Post unliked successfully" : "Post liked successfully"});
});

export const deletePost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;

    const user = await User.findOne()({clerkId: userId});
    const post = await Post.findById(postId);

    if(!user || !post) {
        return res.status(404).json({error: "User or Post not found"});
    }

    if(post.user.toString() !== user._id.toString()) {
        return res.status(403).json({error: "You do not have permission to delete this post"});
    }

    await Comment.deleteMany({post: postId});
    await Post.findByIdAndDelete(postId);
    res.status(200).json({message: "Post deleted successfully"});
})
