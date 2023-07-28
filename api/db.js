import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config();

export const db = mysql.createConnection({
  host:"blog.cwv83wd9elvf.eu-central-1.rds.amazonaws.com",
  user:"admin",
  password: process.env.DB_KEY,
  database:"blog"
})