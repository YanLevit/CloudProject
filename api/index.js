import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const upload = multer();

const s3Client = new S3Client({
  credentials : {
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
  },
  region : "eu-central-1"
});

app.post("/api/upload",upload.single("file"), async function (req, res) {
  const file = req.file;
  console.log(file.originalname);
  const params = {
    Bucket: "blogproject2023",
    Key: Date.now().toString() + '-' + file.originalname,
    Body: file.buffer,
    ACL: "public-read",
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    res.status(200).json({ location: data.Location });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error uploading file to S3" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
