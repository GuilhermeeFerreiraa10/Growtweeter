import { Request, Response } from "express";
import { LikeService } from "../services/like-service";

const service = new LikeService();

export class LikeController {
    async handleLike(req: Request, res: Response) {
        const { userId, tweetId } = req.body;
        
        if (!userId || !tweetId) {
            return res.status(400).json({ error: "UserId e TweetId são obrigatórios" });
        }

        try {
            const result = await service.toggleLike(userId, tweetId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao processar curtida" });
        }
    }
}