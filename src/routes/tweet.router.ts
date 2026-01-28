import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
 
const tweetRouter = Router();
const tweetController = new TweetController();
const likeController = new LikeController();

// --- Feed e Listagem ---
tweetRouter.get("/tweet", tweetController.index); 
// Removi o middleware e o :userId fixo para facilitar
tweetRouter.get("/tweet/feed", (req, res) => tweetController.feed(req, res));

// --- Ações de Tweet (AGORA ABERTAS PARA TESTE) ---
tweetRouter.post("/tweet", (req, res) => tweetController.handle(req, res)); // Removido authMiddleware
tweetRouter.delete("/tweet/:id", (req, res) => tweetController.destroy(req, res)); // Removido authMiddleware

// --- Likes ---
tweetRouter.post("/tweet/like", (req, res) => likeController.handle(req, res));
tweetRouter.post("/tweet/unlike", (req, res) => likeController.destroy(req, res));;

export default tweetRouter;