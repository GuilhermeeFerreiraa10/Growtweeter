import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/comment", async (req, res) => {
  const { content, userId, tweetId } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: { content, userId, tweetId }
    });
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar comentário" });
  }
});

export default router;