import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const {
      uid,
      classe,
      chapitres,
      matieres,
      id,
      title,
      question,
      result,
      type,
      option, // récupéré si choix multiple
      explication,
    } = req.body;

    // Vérification des champs obligatoires
    if (
      !uid ||
      !classe ||
      !matieres ||
      !chapitres ||
      !id ||
      !title ||
      !question ||
      !result ||
      !type ||
      !explication
    ) {
      return res
        .status(400)
        .json({ message: "Des champs obligatoires sont manquants." });
    }

    const DocRef = db.collection("users").doc(uid);
    const userRef = await DocRef.get();

    if (!userRef.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    // Référence à la classe
    const classeDocRef = DocRef.collection("classes").doc(classe);
    const classeSnapshot = await classeDocRef.get();

    const oldTotalExo = classeSnapshot.data()?.TotalExo || {};
    const existingExoForMatiere = oldTotalExo[matieres] || [];

    // Création dans le chapitre
    const chapitresRef = classeDocRef
      .collection("chapitres")
      .doc(chapitres)
      .collection("matieres")
      .doc(matieres)
      .collection("exercices");

    const snapshot = await chapitresRef.get();
    const chapitreCount = snapshot.size;
    const nextChapitreNum = chapitreCount + 1;

    // 🔹 Génération d’IDs uniques
    const histId = `hist_${Date.now()}`;
    const exoId = `exercices${nextChapitreNum}`;

    const chapitreDoc = chapitresRef.doc(exoId);

    const resultArray = Array.isArray(result) ? result : [result];

    // Données exercice
    const exerciceData = {
      id: histId, // ID pour historique
      idExo: exoId, // ID pour exercice dans chapitre
      title,
      question,
      result: resultArray,
      infoErro: `Désolé la bonne réponse était ${resultArray} tu peux faire mieux`,
      infosucces: `Bravos la réponse à la question "${question}" est bien ${resultArray}`,
      type,
      active: false,
      explication,
      chapitre: chapitres,
      classe,
      matieres: matieres,
      dateCreation: new Date().toISOString(),
    };

    if (type === "choix multiple" && Array.isArray(option)) {
      exerciceData.option = option;
    }

    // 1️⃣ Sauvegarde dans la collection du chapitre
    await chapitreDoc.set(exerciceData);

    // 2️⃣ Ajout dans l’historique avec le même ID
    await DocRef.collection("historique").doc(histId).set(exerciceData);

    return res.status(200).json({
      message: `L'exercice ${exoId} a été ajouté et enregistré dans l'historique.`,
      data: exerciceData,
    });
  } catch (error) {
    console.error("Erreur dans l'API :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
