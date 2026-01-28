import { Request, Response } from "express";
import { FollowService } from "../services/follow-service";

const followServiceInstance = new FollowService(); 

export class followController {
  async store(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) return res.status(400).json({ error: "IDs obrigatórios" });
      const follow = await followServiceInstance.follow(followerId, followingId);
      return res.status(201).json(follow);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;
      const result = await followServiceInstance.unfollow(followerId, followingId);
      return res.status(200).json({ message: "Unfollow realizado!" }); 
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao processar unfollow" });
    }
  }
}