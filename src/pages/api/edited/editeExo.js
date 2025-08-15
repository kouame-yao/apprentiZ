import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée !" });
  }

  try {
    const {
      uid,
      classe,
      chapitres,
      matieres,
      num,
      idExo,
      question,
      type,
      result,
      option,
      explication,
    } = req.body;

    // Validation des paramètres requis
    if (!uid || !classe || !chapitres || !matieres) {
      return res.status(400).json({ message: "Des éléments manquants !" });
    }

    const DocUser = db.collection("users").doc(uid);
    const SnapUser = await DocUser.get();

    if (!SnapUser.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    // Préparation des données à mettre à jour
    const Update = {
      question: question,
      result: Array.isArray(result) ? result : [result],
      type: type,
      infosucces: `Bravos ! La réponse à la question "${question}" est bien ${
        Array.isArray(result) ? result.join(", ") : result
      }`,
      explication: explication,
    };

    if (type === "choix multiple" && Array.isArray(option)) {
      Update.option = option;
    }

    // Transaction pour mettre à jour l'exercice dans la classe/matière
    await db.runTransaction(async (transaction) => {
      const exerciceRef = DocUser.collection("classes")
        .doc(classe)
        .collection("chapitres")
        .doc(`chapitres${chapitres}`)
        .collection("matieres")
        .doc(matieres)
        .collection("exercices")
        .doc(num.toString());

      transaction.update(exerciceRef, Update);
    });

    // Transaction pour mettre à jour l'historique si idExo est fourni
    if (idExo !== undefined) {
      await db.runTransaction(async (transaction) => {
        const historiqueRef = DocUser.collection("historique").doc(
          idExo.toString()
        );
        transaction.update(historiqueRef, Update);
      });
    }
    console.log(idExo);

    return res.status(200).json({
      message: "Exercice mis à jour avec succès",
      data: { exerciceMisAJour: Update },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération/mise à jour de l'exercice:",
      error
    );
    return res.status(500).json({
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
