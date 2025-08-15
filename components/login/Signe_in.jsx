import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeClosed, Lock, MailCheck } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import auth from "../../Auth/SDK_cliente/conecteSDK";
import Editepasswords from "../modifierProfil/Editepasswords";

export default function Signe_in() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lording, setloding] = useState(false);
  const router = useRouter();
  const [valueInputs, setValueInputs] = useState({
    email: "",
    password: "",
  });
  const [toggle, setToggle] = useState(false);
  const onchangeValue = (e) => {
    const { name, value } = e.target;
    setValueInputs((prev) => ({ ...prev, [name]: value }));
  };

  const ValideConnect = async () => {
    setloding(true);
    const { email, password } = valueInputs;
    if (!email || !password) {
      alert("tous les champs obligatoire!");
      setloding(false);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      const operation = userCredential.operationType;
      const r = await fetch(`${url}/api/login/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ uid: uid }),
      });

      if (r.ok) {
        toast.success("Vous êtes connecter !");
        router.push("/");
      } else {
        setloding(false);
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        toast.error("Email/password , incorrect !");
        setloding(false);
      }
    }
  };

  return (
    <div className="grid gap-4">
      {/* Email */}
      <div className="grid items-center gap-2">
        <span className="font-serif text-sm md:text-base flex items-center gap-2">
          <MailCheck /> Email d'utilisateur
        </span>
        <input
          required
          onChange={onchangeValue}
          value={valueInputs.email}
          name="email"
          type="email"
          className="w-full border md:border-2 md:p-4 rounded-lg p-2 outline-none focus:border-violet-700 border-gray-400"
          placeholder="Ton email..."
        />
      </div>

      {/* Mot de passe */}
      <div className="grid items-center gap-2 relative">
        <span className="font-serif text-sm md:text-base flex items-center gap-2">
          <Lock /> Mot de passe d'utilisateur
        </span>
        <div className="relative">
          <span
            onClick={() => setToggle(!toggle)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
          >
            {toggle ? <Eye /> : <EyeClosed />}
          </span>
          <input
            required
            onChange={onchangeValue}
            value={valueInputs.password}
            name="password"
            type={toggle ? "text" : "password"}
            className="w-full border md:border-2 md:p-4 rounded-lg p-2 outline-none focus:border-violet-700 border-gray-400"
            placeholder="Mot de passe..."
          />
        </div>
      </div>

      <span
        onClick={() => setIsModalOpen(true)}
        className="text-violet-600 cursor-pointer"
      >
        Mot de passe oublier ?
      </span>

      {/* Bouton */}
      <button
        onClick={ValideConnect}
        className="w-full bg-violet-500 rounded-lg border-none text-white font-semibold p-2 md:p-4 cursor-pointer transition-colors duration-200 hover:bg-violet-600"
      >
        {lording ? (
          <div className="flex gap-1 items-center justify-center ">
            <div className=" animate-spin h-4 w-4 border-2 rounded-full border-t-transparent border-white "></div>
            <span>Connexion...</span>
          </div>
        ) : (
          "Se connecter"
        )}
      </button>

      {/* Lien retour */}
      <span
        className="text-center text-gray-600 hover:text-violet-600 cursor-pointer block"
        onClick={() => router.push("/")}
      >
        ← Retour à l'accueil
      </span>
      {isModalOpen && (
        <section>
          <Editepasswords closeModals={() => setIsModalOpen(false)} />
        </section>
      )}
    </div>
  );
}
