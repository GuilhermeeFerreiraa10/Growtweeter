import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Tentativa de acesso sem login barrada pelo Middleware.");
    return res.status(401).json({ 
      error: "Acesso negado. Você não está logado!" 
    });
  }

  console.log("Middleware: Token detectado. Permitindo acesso...");
  return next();
}; 