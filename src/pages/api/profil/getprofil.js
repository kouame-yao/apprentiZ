import jwt from "jsonwebtoken";
import { cors, runMiddleware } from "../../../../lib/cors";
const cookie = require("cookie");
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "GET") {
    return res.status(405).json({ message: "La methode est incorrect " });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.auth_token;
    const key = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, key);

    res.status(200).json({ uid: decoded.uid });
  } catch (error) {
    console.log(error.message);
  }
}
