import { useQuery } from "@tanstack/react-query";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

import {
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import auth from "../../Auth/SDK_cliente/conecteSDK";
import { ApplicationContext } from "../../context/ApplicationContextProvider";

export default function ProfileModal({ closeModal }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [utilisateur, setUtilisateur] = useState("");
  const { uid } = useContext(ApplicationContext);
  const [lording, setloding] = useState(false);
  const { data } = useQuery({
    queryKey: ["repoData", uid],
    // 🔧 AMÉLIORATION: Désactiver le cache stale pour avoir des données fraîches
    // staleTime: 1,
    // cacheTime: 1,
    queryFn: async () => {
      if (!uid) {
        throw new Error("UID manquant");
      }
      const res = await fetch(`${url}/api/user/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur inconnue");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes: pas de refetch pendant ce temps
    cacheTime: 1000 * 60 * 30, // 30 minutes: données gardées en mémoire
  });
  const users = data?.user;

  const [formData, setFormData] = useState({
    prenom: users?.prenom || "",
    nom: users?.nom || "",
    classe: users?.classe || "",
    password: users?.email || "",
    appreciation: users?.appreciation || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let texte = value;

    if ((texte.length > 0 && name === "nom") || name === "prenom") {
      texte = texte.charAt(0).toUpperCase() + texte.slice(1);
    }

    setFormData((prev) => ({ ...prev, [name]: texte }));
  };

  const handleSave = async () => {
    setloding(true);

    if (
      !formData.classe ||
      !formData.prenom ||
      !formData.nom ||
      !formData.appreciation
    ) {
      toast.warning("Tous les champs sont obligatoires !");
      setloding(false);
      return;
    }
    const body = {
      uid: uid,
      nom: formData.nom,
      prenom: formData.prenom,
      classe: formData.classe,
      appreciation: formData.appreciation,
    };
    try {
      const r = await fetch(`${url}/api/user/editeuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await r.json();

      if (r.ok) {
        setloding(false);
        toast.success(data.message);
      }
    } catch (error) {
      setloding(false);
      toast.error(error.message);
    }
  };

  const confirmeSupprimer = async () => {
    const email = users?.email;
    const password = prompt("Veillez entrez votre mot de pass !");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Vérifiez que c'est le bon utilisateur
      if (user.uid === uid) {
        // Maintenant vous pouvez faire la réauthentification si nécessaire
        setUtilisateur(user);
        setShowDeleteConfirm(true);
      } else {
        throw new Error("UID ne correspond pas");
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        toast.error("Mot de passe incorrect !");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (utilisateur) {
        await deleteUser(utilisateur);
        const r = await fetch(`${url}/api/user/deleteuser`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ uid: uid }),
        });
        const data = await r.json();
        if (r.ok) {
          toast.success(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }

    setIsModalOpen(false);
  };

  const logout = async () => {
    try {
      const r = await fetch(`${url}/api/user/logout`, {
        method: "POST",
      });
      const data = await r.json();
      if (r.ok) {
        setTimeout(() => {
          toast.success(data.message);
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl mx-2 sm:mx-4 transform transition-all duration-300 max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 border-b border-gray-100">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
            <User className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
            <span className="hidden xs:inline">Modifier le profil</span>
            <span className="xs:hidden">Profil</span>
          </h2>
          <button
            onClick={closeModal}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        {!showDeleteConfirm ? (
          <>
            {/* Form */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
              {/* Première ligne - Prénom et Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Prénom */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Votre prénom"
                  />
                </div>

                {/* Nom */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Classe */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  Classe
                </label>
                <input
                  type="text"
                  name="classe"
                  value={formData.classe}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Votre classe"
                />
              </div>
              {/* Appreciation */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  Appreciation
                </label>
                <input
                  type="text"
                  name="appreciation"
                  value={formData.appreciation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Appréciation de l'élève"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  Email
                </label>
                <div className="relative">
                  <input
                    disabled
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pr-12 sm:px-5 sm:py-4 sm:pr-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-8 bg-gray-50 rounded-b-2xl">
              {/* Mobile: 3 boutons empilés */}
              <div className="block sm:hidden space-y-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 font-semibold text-sm justify-center w-full"
                >
                  {lording ? (
                    <div className="flex gap-1 items-center justify-center ">
                      <div className=" animate-spin h-4 w-4 border-2 rounded-full border-t-transparent border-white "></div>
                      <span>Modification en cour...</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </div>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-semibold text-sm text-center w-full"
                >
                  Annuler
                </button>
                <button
                  onClick={() => confirmeSupprimer()}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-semibold text-sm justify-center w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer le profil
                </button>
              </div>

              {/* Desktop: Layout horizontal classique */}
              <div className="hidden sm:flex items-center justify-between">
                <button
                  onClick={() => confirmeSupprimer()}
                  className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-semibold text-base"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer le profil
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="px-8 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-semibold text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 font-semibold shadow-lg text-base"
                  >
                    {lording ? (
                      <div className="flex gap-1 items-center justify-center ">
                        <div className=" animate-spin h-4 w-4 border-2 rounded-full border-t-transparent border-white "></div>
                        <span>Modification en cour...</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <Save className="w-4 h-4" />
                        Sauvegarder
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation de suppression */
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">
                  Supprimer le profil ?
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Cette action est irréversible. Toutes vos données seront
                  définitivement supprimées.
                </p>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-8 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-semibold text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleDelete(), logout();
                  }}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
