import db from "../../../../Auth/firebase_admin";

async function deleteCollection(dbRef, batchSize = 100) {
  const snapshot = await dbRef.limit(batchSize).get();
  if (snapshot.size === 0) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  if (snapshot.size === batchSize) {
    return deleteCollection(dbRef, batchSize);
  }
}

// Fonction récursive pour supprimer un document et TOUTES ses sous-collections
async function deleteDocAndSubcollections(docRef) {
  const subcollections = await docRef.listCollections();

  for (const subcol of subcollections) {
    await deleteCollection(subcol);
  }

  await docRef.delete();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "La méthode doit être POST" });
  }

  try {
    const { uid, classe } = req.body;
    if (!uid || !classe) {
      return res.status(400).json({ message: "Des éléments manquent !" });
    }

    const userDoc = db.collection("users").doc(uid);
    const userSnap = await userDoc.get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    const classeDoc = userDoc.collection("classes").doc(classe);

    // 1. Supprimer tous les chapitres et leurs sous-collections (matières, exercices)
    const chapitresSnap = await classeDoc.collection("chapitres").get();
    for (const chapitreDoc of chapitresSnap.docs) {
      await deleteDocAndSubcollections(chapitreDoc.ref);
    }

    // 2. Supprimer l'historique lié à cette classe
    const historiqueSnap = await userDoc
      .collection("historique")
      .where("classe", "==", classe)
      .get();
    const batchHistorique = db.batch();
    historiqueSnap.docs.forEach((doc) => batchHistorique.delete(doc.ref));
    await batchHistorique.commit();

    // 3. Supprimer le document classe lui-même
    await classeDoc.delete();

    res.status(200).json({
      message: `La classe ${classe} a été supprimée avec succès.`,
      chapitresSupprimes: chapitresSnap.size,
      historiqueSupprime: historiqueSnap.size,
    });
  } catch (error) {
    console.error("Erreur suppression classe:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
