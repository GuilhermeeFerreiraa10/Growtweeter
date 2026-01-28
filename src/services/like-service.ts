import { prisma } from "../database/prisma.database";

export class LikeService {
  async toggleLike(userId: string, tweetId: string) {
    // 1. Verifica se o usuário existe (removi a trava de isLogged para facilitar seu teste)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado.");

    // 2. Busca se já existe um like deste usuário neste tweet
    const existingLike = await prisma.like.findFirst({
      where: { userId, tweetId },
    });

    // 3. Lógica de Toggle (Alternância)
    if (existingLike) {
      // Se já curtiu, agora a gente descurte (deleta)
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { message: "Curtida removida!" };
    }

    // Se não curtiu, a gente curte (cria)
    await prisma.like.create({
      data: { userId, tweetId },
    });
    return { message: "Tweet curtido!" };
  }

async removeLike(userId: string, tweetId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isLogged) {
    throw new Error("Você precisa estar logado para realizar esta ação.");
  }
  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      tweetId: tweetId,
    },
  });
  if (!existingLike) {
    throw new Error("Você ainda não curtiu este tweet.");
  }
  return await prisma.like.delete({
    where: { id: existingLike.id },
  });
}
}
