import express from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import carRoutes from "./routes/cars.js"
import fromRoutes from "./routes/forms.js"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

//middlewares

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(cookieParser())


app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/casr", carRoutes)
app.use("/api/forms", fromRoutes)


app.listen(8800, ()=>{
    console.log("connected")
});
