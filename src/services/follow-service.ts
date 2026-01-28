import { prisma } from "../database/prisma.database";
export class FollowService {
  async follow(followerId: string, followingId: string) {
    const followerExists = await prisma.user.findUnique({ where: { id: followerId } });
    const followingExists = await prisma.user.findUnique({ where: { id: followingId } });

    if (!followerExists || !followingExists) {
      throw new Error("Um ou ambos os usuários não existem.");
    }
    return await prisma.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    return await prisma.follow.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
  }
}