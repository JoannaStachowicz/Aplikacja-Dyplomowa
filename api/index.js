import express from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import carRoutes from "./routes/cars.js"
import changeOwnerRouter from "./routes/changeOwners.js"
import newsPanelRouter from "./routes/newsPanel.js"

//import fromRoutes from "./routes/forms.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

app.use(express.json())

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    },
});

const upload = multer({ storage: storage });


app.post('/api/upload', upload.single("file"), (req, res) => {
    const file = req.file;
    console.log("Received file:", file);

    if (!file) {
        return res.status(400).json({ error: "File upload failed" });
    }

    res.status(200).json(file.filename);  // potrzebujemy filename do bazy danych
});


app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", carRoutes)
app.use("/api", changeOwnerRouter)
app.use("/api/news", newsPanelRouter)


app.listen(8800, ()=>{
    console.log("connected")
});
