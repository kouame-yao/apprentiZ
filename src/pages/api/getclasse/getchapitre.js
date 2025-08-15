import db from "../../../../Auth/firebase_admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { uid, classe } = req.body;

    if (!uid || !classe) {
      return res.status(400).json({ message: "uid manquant!" });
    }

    const DocRef = db.collection("users").doc(uid);
    const userRef = await DocRef.get();

    if (!userRef.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    const userData = await DocRef.collection("classes")
      .doc(classe)
      .collection("chapitres")
      .get();
    const table = [];

    userData.forEach((doc) => {
      table.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ table });
  } catch (error) {
    console.error("Erreur dans l'API getclasse :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
