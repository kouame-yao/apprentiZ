const cookie = require("cookie");
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode incorrecte !" });
  }

  try {
    const { uid } = req.body;
    const key = process.env.JWT_SECRET;
    if (!uid) {
      return res.status(400).json({ message: "Champs manquant !" });
    }

    // Générer un token JWT avec l'UID
    const token = jwt.sign({ uid }, key, {
      expiresIn: "7d",
    });

    // Définir le cookie sécurisé
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth_token", token, {
        httpOnly: true, // empêche accès via JS
        secure: process.env.NODE_ENV === "production", // HTTPS seulement en prod
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60, // 7 jours
        path: "/",
      })
    );

    // ✅ On renvoie une réponse JSON au client
    return res.status(200).json({
      message: "Connexion réussie",
      uid,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
