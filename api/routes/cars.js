// endpointy do pobierania listy pojazdów i rejestrowania pojazdu

import express from "express";
import { getCars, regCar } from "../controllers/car.js";

const router = express.Router()

router.get("/cars", getCars)
router.post("/carReg", regCar)

export default router