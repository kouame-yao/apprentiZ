import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import Wrapper from "../../../components/Wrapper";
import { ApplicationContext } from "../../../context/ApplicationContextProvider";
import { protectPage } from "../../../lib/auth";

export default function Classe() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { uid } = useContext(ApplicationContext);
  // États pour la gestion de l'interface
  const [MatierePage, setMatierePage] = useState("Mathématiques");
  const [Score, setscore] = useState({});
  const [Pourcentage, setPourcentage] = useState({});
  const [activeEtape, setActiveEtape] = useState(true);
  const MapMatiere = [{ matiere: "Mathématiques" }, { matiere: "Français" }];
  // Router pour la navigation
  const router = useRouter();
  const classeId = router.query;

  /**
   * Effet pour récupérer la matière depuis le localStorage au chargement
   */
  useEffect(() => {
    const raw = localStorage.getItem("Matiere");
    if (raw) {
      setMatierePage(raw);
    }
  }, []);

  /**
   * Fonction pour changer de matière et sauvegarder dans localStorage
   * @param {string} mat - Nom de la matière sélectionnée
   */
  const toggle = (mat) => {
    localStorage.setItem("Matiere", mat);
    setMatierePage(mat);
    // console.log("Matière sélectionnée:", mat);
  };

  // Configuration utilisateur

  /**
   * Requête pour récupérer les chapitres de la classe
   */
  const {
    isPending: isPenChapitre,
    error: errorChapitre,
    data: dataChapitre,
  } = useQuery({
    queryKey: ["chapitre", uid, classeId.id],
    enabled: !!uid && !!classeId.id, // Ne se déclenche que si uid et classeId.id existent
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getchapitre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, classe: classeId.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || "Erreur lors du chargement des chapitres"
        );
      }

      return res.json();
    },
  });

  /**
   * Requête pour récupérer les matières et scores
   */
  const {
    isPending: isPenMatiere,
    error: errorMatiere,
    data: dataMatiere,
  } = useQuery({
    queryKey: ["score", uid, classeId.id],
    enabled: !!uid && !!classeId.id, // Ne se déclenche que si uid et classeId.id existent
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getscore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          classe: classeId.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || "Erreur lors du chargement des scores"
        );
      }

      return res.json();
    },
  });

  /**
   * Fonction pour calculer le pourcentage de progression totale
   * @param {Array} scores - Tableau des scores
   * @returns {number} Pourcentage de progression
   */
  const calculateTotalProgress = (scores) => {
    if (!scores || scores.length === 0) return 0;

    const totalQuestions = scores.reduce(
      (acc, item) => acc + (item?.length || 0),
      0
    );
    const totalCorrect = scores.reduce(
      (acc, item) => acc + (item?.score || 0),
      0
    );

    return totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;
  };

  /**
   * Fonction pour obtenir la description de la classe
   * @param {string} classeId - ID de la classe
   * @returns {string} Description de la classe
   */
  const getClasseDescription = (classeId) => {
    const descriptions = {
      CP1: "Cours Préparatoire Première année",
      CP2: "Cours Préparatoire Deuxième année",
      CE1: "Cours Élémentaire Première année",
      CE2: "Cours Élémentaire Deuxième année",
      CM1: "Cours Moyen Première année",
      CM2: "Cours Moyen Deuxième année",
    };
    return descriptions[classeId] || "Cours Secondaire";
  };

  // Gestion des états de chargement et d'erreur
  if (isPenChapitre || isPenMatiere) {
    return (
      <Wrapper name={"Mon profil"} color={"bg-green-500"} button={"/profil"}>
        <div className="flex justify-center items-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <p className="text-lg font-semibold">Chargement...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (errorChapitre) {
    return (
      <Wrapper name={"Mon profil"} color={"bg-green-500"} button={"/profil"}>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">
              Erreur chapitres : {errorChapitre.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (errorMatiere) {
    return (
      <Wrapper name={"Mon profil"} color={"bg-green-500"} button={"/profil"}>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">
              Erreur matières : {errorMatiere.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }

  // Extraction et traitement des données
  const chap = dataChapitre?.table || [];
  const mat = dataMatiere?.table || [];

  // Traitement des matières disponibles
  const mets = mat.map((item) => item.nom || []);
  const plat = mets.flat(); // Aplatit le tableau si nécessaire
  const objetMat = plat.map((item) => ({ matiere: item }));

  // Récupération des scores pour la matière sélectionnée
  const scoreData = mat.map(
    (item) => item[MatierePage] || { score: 0, length: 0 }
  );

  // Calcul de la progression totale
  const totalProgress = calculateTotalProgress(scoreData);

  // console.log("Chapitres:", chap);
  // console.log("Matières:", objetMat);
  // console.log("Scores:", scoreData);

  return (
    <Wrapper
      name={"Mon profil"}
      color={"bg-green-500"}
      button={"/profil"}
      textColor={"text-white"}
    >
      <main className="px-4  md:px-40  md:space-y-20 space-y-4">
        {/* Section d'en-tête avec progression */}
        <section>
          <div className="card-body bg-red-400 rounded-3xl p-8 md:p-15 text-white">
            <h1 className="text-4xl font-bold md:text-5xl">{classeId.id}</h1>
            <div className="flex justify-center items-center">
              <p className="text-lg text-gray-200 md:text-4xl">
                {getClasseDescription(classeId.id)}
              </p>
              <span className="text-7xl md:text-8xl">🎓</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="md:text-2xl">Progression générale</span>
              <span className="md:text-2xl">{totalProgress}%</span>
            </div>
            <div className="h-2 md:h-4 rounded-3xl w-full bg-white/50">
              <div
                className="h-2 md:h-4  rounded-full bg-blue-400 transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Section de sélection des matières */}
        <section className="flex justify-center text-center h-auto ">
          <div className="bg-white py-2 rounded-full w-full md:w-[40%] md:p-4 flex px-2 p-8 justify-center md:gap-17 gap-2">
            {objetMat.length > 0 ? (
              MapMatiere.map((item, index) => {
                const active = MatierePage === item.matiere;
                const bgColor = active
                  ? "bg-blue-400 text-white"
                  : "bg-white text-black";
                const icon = item.matiere === "Mathématiques" ? "📊" : "📚";
                return (
                  <button
                    onClick={() => toggle(item.matiere)}
                    key={index}
                    className={`font-bold ${bgColor} cursor-pointer w-full md:text-3xl md:p-5 p-2 rounded-full transition-all duration-200`}
                  >
                    {icon} {item.matiere}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                Aucune matière disponible
              </div>
            )}
          </div>
        </section>

        {/* Section des chapitres */}
        <section className="w-full">
          {chap.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-2 md:gap-20 ">
              {chap.map((item, index) => {
                let ChapitreDebloquer = true;
                const scoreInfo = scoreData[index] || { score: 0, length: 0 };
                const progressPercent =
                  scoreInfo.length > 0
                    ? Math.round((scoreInfo.score / scoreInfo.length) * 100)
                    : 0;

                const debloque =
                  index === 0
                    ? true
                    : ChapitreDebloquer && scoreData[index - 1]?.score >= 4;
                ChapitreDebloquer = debloque;
                const icon = debloque ? "📖" : " 🔒";

                const text = debloque ? "Commencer" : "Verrouillé";

                return (
                  <div
                    onClick={() =>
                      router.push(
                        `/exercice/${MatierePage}/${
                          item.ordre || index + 1
                        }?classe=${classeId.id}`
                      )
                    }
                    key={item.id || index}
                    className={`${
                      debloque ? "bg-white shadow-lg" : "bg-white/60"
                    }  rounded-3xl px-4 py-4 cursor-pointer grid gap-2 text-left md:px-10 md:py-8 md:h-100 w-full box-border transition-all duration-300 hover:-translate-y-1 md:hover:scale-110 md:scale-105  scale-100`}
                  >
                    <div className="grid gap-2 text-3xl ">
                      <span className="md:text-5xl">{icon}</span>
                      <span className="font-bold text-lg md:text-4xl">
                        {item.titre || `Chapitre ${index + 1}`}
                      </span>
                      <span className="text-sm md:text-2xl text-gray-600">
                        {item.title[MatierePage] || "Sans titre"}
                      </span>
                    </div>

                    {/* Barre de progression du chapitre */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="text-green-400 border-none md:p-5 md:px-5 rounded-full md:text-2xl bg-green-200 badge badge-success font-bold self-center">
                      Score: {scoreInfo.score}/{scoreInfo.length}
                    </div>

                    <button
                      disabled={!debloque}
                      onClick={() =>
                        router.push(
                          `/exercice/${MatierePage}/${
                            item.ordre || index + 1
                          }?classe=${classeId.id}`
                        )
                      }
                      className=" p-2 md:text-2xl  disabled:bg-gray-300 disabled:text-black/30 text-white bg-green-500   cursor-pointer rounded-2xl border-none btn-success font-bold hover:scale-105 transition-transform"
                    >
                      {text}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-white rounded-3xl p-8">
                <span className="text-6xl">📚</span>
                <h3 className="text-xl font-bold mt-4">
                  Aucun chapitre disponible
                </h3>
                <p className="text-gray-600 mt-2">
                  Les chapitres pour cette classe seront bientôt disponibles.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Section de retour */}
        <section className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="p-4 cursor-pointer rounded-4xl md:p-8 md:text-3xl md:rounded-full text-white font-bold text-lg px-4 bg-violet-600 hover:bg-violet-700 transition-colors"
          >
            ← Retour aux classes
          </button>
        </section>
      </main>
    </Wrapper>
  );
}
export async function getServerSideProps({ req }) {
  return protectPage(req);
}
