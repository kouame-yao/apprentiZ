import db from "../../../../Auth/firebase_admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Methode incorrecte !" });
  }
  function formaDate() {
    const today = new Date();
    const jour = String(today.getDate()).padStart(2, "0");
    const mois = String(today.getMonth() + 1).padStart(2, "0");
    const annee = today.getFullYear();

    return `${jour}/${mois}/${annee}`;
  }

  const date = formaDate();

  try {
    const { uid, email, nom, prenom, classe } = req.body;

    if (!email || !nom || !prenom || !classe) {
      return res.status(400).json({ message: "Champs manquant !" });
    }

    const DocUser = await db.collection("users").doc(uid).set(
      {
        email: email,
        nom: nom,
        prenom: prenom,
        classe: classe,
        appreciation: "Débutant",
        DateInsciption: date,
      },
      { merge: true }
    );

    res.status(200).json({ message: "Vous êtes maintenant inscrire !" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
