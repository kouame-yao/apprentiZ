import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";

async function deleteCollection(dbRef, batchSize = 100) {
  const snapshot = await dbRef.limit(batchSize).get();
  if (snapshot.size === 0) {
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // On continue jusqu'à suppression totale
  if (snapshot.size === batchSize) {
    return deleteCollection(dbRef, batchSize);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "La méthode doit être POST" });
  }

  try {
    const { uid, classe, chapitre } = req.body;
    if (!uid || !classe || !chapitre) {
      return res.status(400).json({ message: "Des éléments manquent !" });
    }

    const docUser = db.collection("users").doc(uid);
    const userData = await docUser.get();
    if (!userData.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    // 1. Supprimer les historiques liés au chapitre
    const historiqueSnap = await docUser
      .collection("historique")
      .where("classe", "==", classe)
      .where("chapitre", "==", chapitre)
      .get();
    const batchHistorique = db.batch();
    historiqueSnap.docs.forEach((doc) => {
      batchHistorique.delete(doc.ref);
    });
    await batchHistorique.commit();

    // Référence au chapitre
    const classeRef = docUser.collection("classes").doc(classe);
    const chapitreRef = classeRef.collection("chapitres").doc(chapitre);

    // 2. Pour chaque matière (Mathématiques, Français) dans ce chapitre
    const matieresSnap = await chapitreRef.collection("matieres").get();

    for (const matiereDoc of matieresSnap.docs) {
      const exercicesRef = matiereDoc.ref.collection("exercices");

      // Supprimer tous les exercices de la matière
      await deleteCollection(exercicesRef);

      // Supprimer le document matière
      await matiereDoc.ref.delete();
    }

    // 3. Supprimer le document chapitre
    await chapitreRef.delete();

    return res.status(200).json({
      message: `le "${chapitre}" de la classe "${classe}" a été supprimé avec succès avec ses matières et exercices.`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error.message);
    return res.status(500).json({
      message: "Erreur lors de la suppression serveur",
      error: error.message,
    });
  }
}
