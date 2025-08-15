import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Methode incorrect !" });
  }

  try {
    const { uid, nom, prenom, classe, appreciation } = req.body;
    if (!uid || !nom || !prenom || !classe || !appreciation) {
      return res.status(405).json({ message: "Tous les champs sont réquis !" });
    }
    const DocUser = db.collection("users").doc(uid);
    const userSnap = await DocUser.get();

    if (!userSnap.exists) {
      return res.status(400).json({ message: "Utilisateur introuvable ! " });
    }

    await DocUser.update({
      nom: nom,
      prenom: prenom,
      classe: classe,
      appreciation: appreciation,
    });

    return res
      .status(200)
      .json({ message: "Votre profil à bien été mise ajour avec succèes" });
  } catch (error) {
    console.log(error.message);
    return res.status(405).json({ message: error.message });
  }
}
