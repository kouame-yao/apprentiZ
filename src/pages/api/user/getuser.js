import db from "../../../../Auth/firebase_admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Methode incorrect !" });
  }

  try {
    const { uid } = req.body;

    const DocUser = db.collection("users").doc(uid);
    const UseSnap = await DocUser.get();
    if (!UseSnap.exists) {
      return res.status(400).json({ message: "Utilisateur introuvable !" });
    }

    const User = UseSnap.data();
    return res.status(200).json({ user: User });
  } catch (error) {
    console.log(error.message);
    return res.status(405).json({ message: error.message });
  }
}
