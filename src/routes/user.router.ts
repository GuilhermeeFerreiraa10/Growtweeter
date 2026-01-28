import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { followController } from "../controllers/follow.controller";

const userRouter = Router();
const userCtrl = new UserController();
const followCtrl = new followController();

userRouter.get("/user", userCtrl.index); 
userRouter.post("/user", userCtrl.store); 
userRouter.post("/login", userCtrl.login);
userRouter.post("/logout/:id", (req, res) => userCtrl.logout(req, res));

userRouter.delete("/user/:id", (req, res) => userCtrl.destroy(req, res));


userRouter.post("/follow", (req, res) => followCtrl.store(req, res));
userRouter.delete("/follow", (req, res) => followCtrl.unfollow(req, res)); 

export default userRouter;