import express from "express";
import { getUser } from "../controllers/user.js";

const router = express.Router()


/* pisanie tego  w ten sposób, w tym miejscu nie jest
   zbyt dobrym pomyslem, dlatego po endpoincie będziemy po prostu 
   wywoływać funkcę z folderu controller

router.get("/test", (req, res) => {
    res.send("backend działa :3")
})

zamiast tego mamy robić tak:
*/

router.get("/find/:userId", getUser)


export default router