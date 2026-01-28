import * as dotenv from "dotenv";
dotenv.config();
export const prismaConfig = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!, 
  },
};
export default prismaConfig;