import { sendPasswordResetEmail } from "firebase/auth";
import { Lock, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import auth from "../../Auth/SDK_cliente/conecteSDK";
function Editepasswords({ closeModals }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [emails, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const email = emails.trim();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        // alert("Un email de réinitialisation a été envoyé !");
        toast.success("Un email de réinitialisation a été envoyé !");
        setIsLoading(false);
        setEmail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header avec bouton fermer */}
        <div className="flex justify-end p-4">
          <button
            onClick={closeModals}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Corps de la modal */}
        <div className="px-6 pb-8 -mt-4">
          {/* Icône */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Mot de passe oublié ?
          </h2>

          {/* Texte explicatif */}
          <div className="mb-8 space-y-3 text-gray-600 text-center">
            <p className="text-sm leading-relaxed">
              Pas de panique ! Il arrive à tout le monde d'oublier son mot de
              passe.
            </p>
            <p className="text-sm leading-relaxed">
              Saisissez votre adresse email ci-dessous et nous vous enverrons un
              lien sécurisé pour créer un nouveau mot de passe.
            </p>
            <p className="text-xs text-gray-500">
              Vérifiez aussi vos spams si vous ne recevez pas l'email.
            </p>
          </div>

          {/* Champ email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={emails}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="votre@email.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         sm:text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Bouton envoyer */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !emails.trim()}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent 
                     text-sm font-medium rounded-xl text-white bg-blue-600 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg hover:shadow-xl
                     transform hover:-translate-y-0.5 active:translate-y-0 mb-6"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </button>

          {/* Lien retour */}
          <div onClick={closeModals} className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
              ← Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editepasswords;
