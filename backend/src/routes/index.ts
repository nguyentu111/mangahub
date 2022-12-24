import { Express } from "express";
import lhmangaRouter from "./lhmanga";
import notifyRouter from "./notify";
import userRouter from "./user";
function routes(app: Express) {
  // app.use("/manga", comicRouter);
  app.use("/lhmanga", lhmangaRouter);
  app.use("/notify", notifyRouter);
  app.use("/user", userRouter);
  app.use("/", (req, res) => {
    return res.status(404).json({ message: "not found" });
  });
}

export default routes;
