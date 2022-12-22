import webPushController from "../controllers/webPushController";

// /notify/info
// router.route('/info').post(webPushController().info);

// // /notify/subscribe
// router.route('/subscribe').post(webPushController().subscribe);

// // /notify/unsubscribe
// router.route('/unsubscribe').delete(webPushController().unsubscribe);

// // /notify/update
// router.route('/update').get(webPushController().update);

// export default router;

import { Router } from "express";
const router = Router();
router.post("/info", webPushController().info);
router.post("/subscribe", webPushController().subscribe);
router.delete("/unsubscribe", webPushController().unsubscribe);
router.get("/update", webPushController().update);
export default router;
