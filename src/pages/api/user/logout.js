export default function handler(req, res) {
  // On vide le cookie
  res.setHeader("Set-Cookie", [
    `auth_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`,
  ]);

  return res.status(200).json({ message: "Déconnecté avec succès" });
}
