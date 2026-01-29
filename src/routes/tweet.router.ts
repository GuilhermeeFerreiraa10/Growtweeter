import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { LikeController } from "../controllers/like.controller";
import { CommentController } from "../controllers/comment.controller";
 
const tweetRouter = Router();
const tweetController = new TweetController();
const likeController = new LikeController();
const commentController = new CommentController();

tweetRouter.get("/tweet", tweetController.index); 
tweetRouter.get("/tweet/feed", (req, res) => tweetController.feed(req, res));

// --- Ações de Tweet 
tweetRouter.post("/tweet", (req, res) => tweetController.handle(req, res));
tweetRouter.delete("/tweet/:id", (req, res) => tweetController.destroy(req, res));
tweetRouter.post("/tweet/comment", (req, res) => commentController.store(req, res));
tweetRouter.delete("/tweet/comment/:id", (req, res) => commentController.destroy(req, res));

// --- Likes ---
tweetRouter.post("/tweet/like", (req, res) => likeController.handle(req, res));
tweetRouter.post("/tweet/unlike", (req, res) => likeController.destroy(req, res));

export default tweetRouter;