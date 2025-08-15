import db from "../../../../Auth/firebase_admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "La methode est différente" });
  }

  try {
    const { uid } = req.body;
    const DocRef = db.collection("users").doc(uid);
    const DocUser = await DocRef.get();
    if (!DocUser.exists) {
      return res.status(405).json({ message: "Utilisateur introuvable !" });
    }

    const UserData = await DocRef.collection("classes").get();
    const table = [];
    UserData.forEach((doc) => table.push({ id: doc.id, ...doc.data() }));

    return res
      .status(200)
      .json({ message: "Les différents Données", table: table });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
