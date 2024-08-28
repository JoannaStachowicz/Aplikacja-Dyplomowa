// endpointy do wyświetlania formularzy, inicjowania i konczenia procedury związanej z przerejestrowywaniem pojazdów,
// a takze do wyświetlania szczegółów pojedynczego formularza

import express from "express";
import { getForms, InitChangeOwn, FinishChangeOwn, getForm } from "../controllers/changeOwner.js";

const router = express.Router()

router.get("/forms", getForms)
router.post("/changeOwner", InitChangeOwn)
router.post("/finishChangeOwn", FinishChangeOwn),
router.get("/form/:id", getForm)

export default router