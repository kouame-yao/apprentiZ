import db from "../../../../Auth/firebase_admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { uid, classe, chapitre, matiere, score, length } = req.body;

    if (
      !uid ||
      !classe ||
      !chapitre ||
      !matiere ||
      score === undefined ||
      length === undefined
    ) {
      return res.status(400).json({
        message: `Champs manquants : ${[
          !uid && "uid",
          !classe && "classe",
          !chapitre && "chapitre",
          !matiere && "matiere",
          score === undefined && "score",
          length === undefined && "length",
        ]
          .filter(Boolean)
          .join(", ")}`,
      });
    }
    const DocRef = db.collection("users").doc(uid);
    const userRef = await DocRef.get();

    if (!userRef.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }
    function dateFormate() {
      const today = new Date();
      const jour = String(today.getDate()).padStart(2, "0");
      const mois = String(today.getMonth() + 1).padStart(2, "0");
      const annee = String(today.getFullYear());
      return `${jour}/${mois}/${annee}`;
    }

    const newDate = dateFormate();
    const userData = await DocRef.collection("classes")
      .doc(classe)
      .collection("chapitres")
      .doc(`chapitres${chapitre}`)
      .set(
        {
          [matiere]: {
            score: score,
            length: length,
            ActiveDate: newDate,
          },
        },
        { merge: true }
      );

    return res.status(200).json({ message: `Nouveaux score ${score}` });
  } catch (error) {
    console.error("Erreur dans l'API getclasse :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
