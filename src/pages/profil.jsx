import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast } from "sonner";
import Wrapper from "../../components/Wrapper";
import EditeProfil from "../../components/modifierProfil/EditeProfil";
import Activité from "../../components/naviagtionProfil/Activite/Activité";
import Aperçu from "../../components/naviagtionProfil/Apercu/Aperçu";
import Créer_contenue from "../../components/naviagtionProfil/Créer/Créer_contenue";
import Gérer from "../../components/naviagtionProfil/Gerer/Gérer";
import Supprimer from "../../components/naviagtionProfil/Supprimer/Supprimer";
import { ApplicationContext } from "../../context/ApplicationContextProvider";
import { protectPage } from "../../lib/auth";
// Wrapper Button
const navBouton = {
  name: "🏠 Accueil",
  color: "bg-green-500",
  href: "/",
};

function profile() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { uid } = useContext(ApplicationContext);
  const [Active, setActive] = useState("Aperçu");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const boutonNaviguate = [
    { name: "Aperçu", icon: "📊", text: "text-white" },
    { name: "Activité", icon: "📈", text: "text-white" },
    { name: "Gérer", icon: "📁", text: "text-white" },
    { name: "Supprimer", bg: "bg-red-500", text: "text-white", icon: "🗑️" },
    { name: "Créer", icon: "➕", text: "text-white" },
  ];

  const { data, isPending } = useQuery({
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
  const user = data?.user;
  const logout = async () => {
    try {
      const r = await fetch(`${url}/api/user/logout`, {
        method: "POST",
      });
      const data = await r.json();
      if (r.ok) {
        toast.success(data.message);
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Wrapper
      name={navBouton.name}
      color={navBouton.color}
      button={navBouton.href}
      textColor={"text-white"}
      btnLogoutName={"➜]"}
      btnLogoutClass={
        "btn btn-circle border border-red-700 shadow-lg bg-red-400 text-white hover:bg-red-600 md:p-7 md:gap-5 md:text-3xl "
      }
      btnLogoutClick={() => {
        logout();
      }}
    >
      <main className="px-4 space-y-4">
        <section>
          <div className="bg-white shadow-lg rounded-3xl md:p-10  py-4 w-full text-center ">
            {isPending ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-8 h-8 rounded-full animate-spin border-4  border-t-transparent border-violet-500 "></div>
                <span className="text-lg font-semibold">
                  Chargement du profil...
                </span>
              </div>
            ) : (
              <div className=" md:flex md:gap-10 gap-2 grid place-items-center  md:place-items-start ">
                <button className="btn btn-circle bg-violet-500 p-10 md:p-23 text-center text-white text-3xl">
                  {user?.nom[0]}
                </button>
                <div className="grid gap-3">
                  <div className="grid gap-1 md:place-items-start">
                    <span className="text-2xl font-bold md:text-6xl ">
                      {user?.nom} {user?.prenom}
                    </span>
                    <span className="textarea-md md:text-3xl">
                      Élève en {user?.classe?.toUpperCase()}
                    </span>
                  </div>
                  <div className="md:flex md:gap-8 gap-4 w-full grid justify-center items-center ">
                    <span
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                      }}
                      className="rounded-md shadow-lg btn p-1  grid items-center md:py-1 md:px-4 md:text-2xl bg-green-200 text-green-700"
                    >
                      Modifier le profil ✏️
                    </span>
                    <div className="rounded-md p-1  shadow-lg btn md:text-2xl flex items-center md:px-4 md:py-1 bg-blue-200 text-blue-900">
                      <span className="text-cyan-900">Appréciation:</span>{" "}
                      {user?.appreciation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="bg-white shadow-lg py-3 md:py-6  px-2 grid grid-cols-2 md:flex gap-2 w-full rounded-3xl">
            {boutonNaviguate.map((item, index) => {
              const taille = item.name === "Créer" ? "w-80 " : "w-full ";
              const tailleResponsive = "md:w-full";
              const active =
                item.name === Active
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-500";

              return (
                <button
                  key={index}
                  onClick={() => setActive(item.name)}
                  className={`${active} ${
                    index === 4 ? "col-span-2 w-full" : ""
                  }  md:text-2xl md:rounded-full md:font-bold rounded-2xl md:py-6 p-2 px-3 cursor-pointer ${taille} ${tailleResponsive}`}
                >
                  {item.icon} {item.name}{" "}
                </button>
              );
            })}
          </div>
        </section>
        <section>
          {Active === "Aperçu" && <Aperçu></Aperçu>}

          {Active === "Activité" && <Activité></Activité>}
          {Active === "Gérer" && <Gérer></Gérer>}
          {Active === "Supprimer" && <Supprimer></Supprimer>}
          {Active === "Créer" && <Créer_contenue></Créer_contenue>}
        </section>
        {isModalOpen && (
          <section>
            <EditeProfil
              closeModal={() => {
                setIsModalOpen(!isModalOpen);
              }}
            />
          </section>
        )}
      </main>
    </Wrapper>
  );
}
export async function getServerSideProps({ req }) {
  return protectPage(req);
}
export default profile;
