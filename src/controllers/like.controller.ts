import { Request, Response } from "express";
import { LikeService } from "../services/like-service";

const likeService = new LikeService(); 

export class LikeController {
  async handle(req: Request, res: Response) {
    try {
      const { userId, tweetId } = req.body;
      
      // Chama a função unificada
      const result = await likeService.toggleLike(userId, tweetId);
      
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  async destroy(req: Request, res: Response) {
    try {
      const { userId, tweetId } = req.body;
      await likeService.removeLike(userId, tweetId);
      return res.status(200).json({ message: "Curtida removida!" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}