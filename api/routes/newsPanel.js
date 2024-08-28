// endpointy do pobierania informacji do panelu aktualności 

import express from "express";
import { newForm, infoTechInspect } from '../controllers/newsPanel.js' 

const router = express.Router()

router.get("/newForm", newForm)
router.get("/techInspections", infoTechInspect)


export default router