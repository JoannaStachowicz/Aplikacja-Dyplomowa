// endpointy do wyswietlania, dodawania i edytowania danych uzytkownika

import express from "express";
import { getUser, getDocument, getAddress, addDoc, addAddress, changeAddress, changeDoc, changeUserInfo } from "../controllers/user.js";

const router = express.Router()

router.get("/userProfile", getUser)
router.get("/documentInfo", getDocument)
router.get("/addressInfo", getAddress)

router.post("/addDocument", addDoc)
router.post("/addAddress", addAddress)

router.put("/changeDocument", changeDoc)
router.put("/changeUserInfo", changeUserInfo)
router.put("/changeAddress", changeAddress)


export default router