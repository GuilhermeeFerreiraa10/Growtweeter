import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LikeService {
  async toggleLike(userId: string, tweetId: string) {
    // Verifica se o like já existe
    const existingLike = await prisma.like.findFirst({
      where: { userId, tweetId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { message: "Like removido", liked: false };
    }

    await prisma.like.create({
      data: { userId, tweetId },
    });
    return { message: "Like adicionado", liked: true };
  }
}