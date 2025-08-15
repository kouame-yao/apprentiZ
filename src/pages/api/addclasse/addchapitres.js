import db from "../../../../Auth/firebase_admin";
import { cors, runMiddleware } from "../../../../lib/cors";

// Descriptions par défaut pour chaque matière
const descriptionsParMatiere = {
  Mathématiques:
    "Ce chapitre couvre les concepts fondamentaux des mathématiques, y compris l'algèbre, la géométrie et les statistiques.",
  Français:
    "Ce chapitre explore les bases de la langue française, y compris la grammaire, la conjugaison et la littérature.",
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { uid, classe, mat, description, titre } = req.body;

    if (!uid || !classe || !mat || !titre) {
      return res
        .status(400)
        .json({ message: "Un ou plusieurs champs manquants !" });
    }

    const DocRef = db.collection("users").doc(uid);
    const userRef = await DocRef.get();

    if (!userRef.exists) {
      return res.status(404).json({ message: "Utilisateur introuvable !" });
    }

    const clx = classe.toUpperCase();
    const chapitresRef = DocRef.collection("classes")
      .doc(clx)
      .collection("chapitres");

    // Récupère tous les chapitres existants
    const snapshot = await chapitresRef.get();
    const chapitreCount = snapshot.size;
    // Le prochain numéro à créer
    const nextChapitreNum = chapitreCount + 1;
    const chapitreDoc = chapitresRef.doc(`chapitres${nextChapitreNum}`);

    // Utilise la description fournie par l'utilisateur ou une description par défaut
    const chapitreDescription =
      description ||
      (Array.isArray(mat) && mat.length > 0
        ? descriptionsParMatiere[mat[0]]
        : "");

    // Crée un nouveau chapitre
    await chapitreDoc.set({
      titre: `chapitre ${nextChapitreNum}`,
      ordre: nextChapitreNum,
      description: chapitreDescription,
      nom: mat,
      title: titre,
      classe: classe,
      createdAt: new Date(),
    });

    // Ajoute une sous-collection 'matieres' avec un document pour chaque matière
    const mats = mat.map(async (item) => {
      const matiereDescription =
        description || descriptionsParMatiere[item] || "";
      const matiereRef = chapitreDoc.collection("matieres").doc(item);
      await matiereRef.set({
        nom: item,
        titre: titre,
        description: matiereDescription,
        createdAt: new Date(),
      });
    });

    await Promise.all(mats); // Attendre que toutes les matières soient ajoutées

    return res.status(200).json({
      message: `Le chapitre chapitres${nextChapitreNum} a été ajouté à la classe ${clx}`,
    });
  } catch (error) {
    console.error("Erreur dans l'API :", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
