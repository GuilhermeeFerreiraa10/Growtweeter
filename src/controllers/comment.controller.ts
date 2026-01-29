import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentController {
  async store(req: Request, res: Response) {
    const { content, userId, tweetId } = req.body;
    if (!content || !userId || !tweetId) {
      return res.status(400).json({ error: "Conteúdo, usuário e tweet são obrigatórios." });
    }
    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId,
          tweetId
        }
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error("Erro ao comentar:", error);
      return res.status(500).json({ error: "Erro interno ao salvar comentário." });
    }
}

async destroy(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID do comentário é obrigatório." });
    }

    try {
        await prisma.comment.delete({
            where: { 
                id: String(id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar:", error);
        return res.status(400).json({ error: "Comentário não encontrado." });
    }
}
}