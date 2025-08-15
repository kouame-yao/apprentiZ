import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { uid, classe, identifiant, description, couleur } = req.body; // Correction ici

    if (!uid || !classe || !identifiant || !description || !couleur) {
      return res
        .status(400)
        .json({ message: "Un ou plusieurs champs manquants!" });
    }

    const DocRef = db.collection("users").doc(uid);
    const userRef = await DocRef.get();

    if (!userRef.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    await DocRef.collection("classes").doc(classe).set(
      {
        nom: classe,
        Ident: identifiant,
        Descrip: description,
        Color: couleur,
      },
      { merge: true }
    );

    return res
      .status(200)
      .json({ message: `La classe ${classe} a bien été ajoutée` });
  } catch (error) {
    console.error("Erreur dans l'API getclasse :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
