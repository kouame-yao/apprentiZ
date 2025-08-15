// lib/auth.js
import jwt from "jsonwebtoken";
const cookie = require("cookie");

export function protectPage(req, redirectTo = "/") {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.auth_token;
  const key = process.env.JWT_SECRET;
  if (!token) {
    return {
      redirect: { destination: redirectTo, permanent: false },
    };
  }

  try {
    const decoded = jwt.verify(token, key);
    return { props: { uid: decoded.uid } };
  } catch {
    return {
      redirect: { destination: redirectTo, permanent: false },
    };
  }
}
