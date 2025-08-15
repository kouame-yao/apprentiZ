import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Eye,
  EyeClosed,
  GraduationCap,
  Lock,
  MailCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import auth from "../../Auth/SDK_cliente/conecteSDK";

export default function Sign_up() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [lording, setloding] = useState(false);
  const [valueInputs, setValueInputs] = useState({
    nom: "",
    prenom: "",
    classe: "",
    email: "",
    password: "",
    confirmepasseword: "",
  });

  const [viewMdp, setViewMdp] = useState(null);
  const [toggle, setToggle] = useState(false);

  const onchangeValue = (e) => {
    const { name, value } = e.target;
    let texte = value;

    if ((texte.length > 0 && name === "nom") || name === "prenom") {
      texte = texte.charAt(0).toUpperCase() + texte.slice(1);
    }

    setValueInputs((prev) => ({ ...prev, [name]: texte }));
  };

  const ValideInsciption = async () => {
    setloding(true);
    const { nom, prenom, classe, email, password, confirmepasseword } =
      valueInputs;

    if (
      !nom ||
      !prenom ||
      !classe ||
      !email ||
      !password ||
      !confirmepasseword
    ) {
      toast.warning("Tous les champs sont obligatoires !");
      setloding(false);
      return;
    }

    // Optionnel : validation simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Email invalide");
      setloding(false);
      return;
    }

    if (password !== confirmepasseword) {
      toast.warning("Le mot de passe doit être identique");
      setloding(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      const r = await fetch(`${url}/api/login/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          email: email,
          nom: nom,
          prenom: prenom,
          classe: classe,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setloding(false);
        throw new Error(data.message);
      }

      if (r.ok) {
        setloding(false);
        toast.success(data.message);
        setValueInputs({
          nom: "",
          prenom: "",
          classe: "",
          email: "",
          password: "",
          confirmepasseword: "",
        });
      }
      // Ici tu peux aussi enregistrer le nom en base ou dans Firestore
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setloding(false);
        toast.error("Votre email existe déjà !");
      }
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nom */}
        <div className="grid gap-2">
          <span className="font-serif flex items-center gap-1">
            <User /> Ton Nom
          </span>
          <input
            onChange={onchangeValue}
            value={valueInputs.nom}
            name="nom"
            type="text"
            className="w-full border md:border-2 md:p-4 rounded-lg p-2 outline-none focus:border-violet-700 border-gray-400"
            placeholder="Ton Nom..."
          />
        </div>

        {/* Prénom */}
        <div className="grid gap-2">
          <span className="font-serif flex items-center gap-1">
            <User /> Ton Prénom
          </span>
          <input
            onChange={onchangeValue}
            value={valueInputs.prenom}
            name="prenom"
            type="text"
            className="w-full border md:border-2 md:p-4 rounded-lg p-2 outline-none focus:border-violet-700 border-gray-400"
            placeholder="Ton Prénom..."
          />
        </div>

        {/* Classe */}
        <div className="grid gap-2 col-span-1 sm:col-span-2">
          <span className="font-serif flex items-center gap-1">
            <GraduationCap /> Ta classe
          </span>
          <input
            onChange={onchangeValue}
            value={valueInputs.classe}
            name="classe"
            type="text"
            className="w-full border md:border-2 md:p-4 rounded-lg p-2 outline-none focus:border-violet-700 border-gray-400"
            placeholder="Ta classe..."
          />
        </div>
      </div>

      {/* Email */}
      <div className="grid items-center gap-2">
        <span className="font-serif flex items-center gap-1">
          <MailCheck /> Email d'utilisateur
        </span>
        <input
          onChange={onchangeValue}
          value={valueInputs.email}
          name="email"
          type="email"
          className="w-full border rounded-lg p-2 md:p-4 outline-none focus:border-violet-700 border-gray-400"
          placeholder="Ton email..."
        />
      </div>

      {/* Mot de passe */}
      <div className="grid gap-2">
        <div className="grid items-center gap-2 relative">
          <span className="font-serif flex items-center gap-1">
            <Lock /> Mot de passe
          </span>
          <div className="relative">
            <span
              onClick={() => {
                setViewMdp("span1");
                setToggle(!toggle);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
            >
              {viewMdp === "span1" && toggle ? <Eye /> : <EyeClosed />}
            </span>
            <input
              onChange={onchangeValue}
              value={valueInputs.password}
              name="password"
              type={viewMdp === "span1" && toggle ? "text" : "password"}
              className="w-full border rounded-lg p-2 md:p-4 outline-none focus:border-violet-700 border-gray-400"
              placeholder="Mot de passe..."
            />
          </div>
        </div>

        {/* Confirme mot de passe */}
        <div className="grid items-center gap-2 relative">
          <span className="font-serif flex items-center gap-1">
            {" "}
            <Lock /> Confirme le mot de passe
          </span>
          <div className="relative">
            <span
              onClick={() => {
                setViewMdp("span2");
                setToggle(!toggle);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
            >
              {viewMdp === "span2" && toggle ? <Eye /> : <EyeClosed />}
            </span>
            <input
              onChange={onchangeValue}
              value={valueInputs.confirmepasseword}
              name="confirmepasseword"
              type={viewMdp === "span2" && toggle ? "text" : "password"}
              className="w-full border rounded-lg p-2 md:p-4 outline-none focus:border-violet-700 border-gray-400"
              placeholder="Confirme le mot de passe..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={ValideInsciption}
        className="w-full bg-violet-500 rounded-lg text-white font-semibold p-2 md:p-4 cursor-pointer"
      >
        {lording ? (
          <div className="flex gap-1 items-center justify-center ">
            <div className=" animate-spin h-4 w-4 border-2 rounded-full border-t-transparent border-white "></div>
            <span>Insciption...</span>
          </div>
        ) : (
          "S'inscrire"
        )}
      </button>

      <span
        className="text-center cursor-pointer text-gray-600 hover:text-violet-600"
        onClick={() => router.push("/")}
      >
        ← Retour à l'accueil
      </span>
    </div>
  );
}
