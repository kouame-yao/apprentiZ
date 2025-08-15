import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApplicationContext } from "../../../context/ApplicationContextProvider";

export default function Aperçu() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  // Configuration utilisateur
  const { uid } = useContext(ApplicationContext);

  /**
   *
   * Requet de recuperation de tout les exercices
   */

  const {
    isPending: isPenHistorique,
    error: errorHistorique,
    data: dataHistorique,
  } = useQuery({
    queryKey: ["Historique", uid],
    enabled: !!uid, // Ne se déclenche que si uid et classeId.id existent
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/gethistorique`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
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
  // Recuperation des données de la table Historique
  const HistoDesExo = dataHistorique?.table;
  //Nombre des données dans la table Historique
  const nombreExo = HistoDesExo?.length;
  // Nombre des Exercices Trouver
  const nombreExoTerminés = (HistoDesExo || []).filter(
    (item) => item.active === true
  );
  // Calcul de la moyen sur 20
  const Moyen = (Exoter, ExoTotal) => {
    if (ExoTotal === 0) return;

    return (Exoter / ExoTotal) * 20;
  };
  const MoyenExo = Moyen(nombreExoTerminés?.length, nombreExo);

  // Rangé les exercice par matière

  const OrdonneParMatiere = HistoDesExo?.reduce((acc, item) => {
    if (!acc[item.matieres]) {
      acc[item.matieres] = [];
    }
    acc[item.matieres].push(item);

    return acc;
  }, {});

  const MatierePref = (data) => {
    let maxCount = 0;
    let matiereMax = null;

    for (const matiere in data) {
      const count = data[matiere]?.filter((exo) => exo.active === true).length;

      if (count > maxCount) {
        maxCount = count;
        matiereMax = matiere;
      }
    }
    return matiereMax;
  };

  const pref = MatierePref(OrdonneParMatiere);

  // Progressions par matière
  function Progresse(data) {
    const result = [];
    for (let doc in data) {
      const count = data[doc].filter((exo) => exo.active === true).length || 0;
      const counts = data[doc].map((exo) => exo.active).length || 0;

      const pourcent = (count / counts) * 100;

      result.push({ matiere: doc, Pourcent: Number(pourcent.toFixed(0)) });
    }
    return result;
  }

  const Progressions = Progresse(OrdonneParMatiere);

  const resultatCatuelle = [
    {
      icon: "📚",
      title: nombreExo || 0,
      description: "Exercices disponible",
    },
    {
      icon: "✅",
      title: nombreExoTerminés?.length || 0,
      description: "Exercices terminés",
    },
    {
      icon: "🎯",
      title: `${MoyenExo?.toFixed(0) || 0}/20`,
      description: "Score moyen",
    },
    { icon: "❤️", title: pref, description: "Matière préférée" },
  ];

  // Gestion des états de chargement et d'erreur
  if (isPenHistorique) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <p className="text-lg font-semibold">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // console.log("TableCountactive:", TableCountactive);
  // console.log("Premier élément:", TableCountactive[0]);
  // console.log("Mathématiques du premier:", TableCountactive[0]?.Mathématiques);

  return (
    <div className="w-full">
      <main className="space-y-4 mb-8 md:w-full">
        <section className="grid grid-cols-2 gap-3 w-full md:flex">
          {resultatCatuelle.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg grid md:py-8 justify-center items-center text-center space-y-3 p-3 md:flex-1 "
              >
                <span className="md:text-5xl">{item.icon}</span>
                <span className="md:text-3xl md:font-bold">{item.title} </span>
                <span className="md:text-2xl">{item.description} </span>
              </div>
            );
          })}
        </section>

        <section>
          <div className="bg-white w-full rounded-2xl shadow-lg p-4 md:p-8 grid space-y-4">
            <span className="font-bold md:text-4xl">
              Progression par matière
            </span>

            {Progressions?.map((item, index) => {
              const icon = item.matiere === "Mathématiques" ? "📊" : "📚";
              const bg =
                item.matiere === "Mathématiques" ? "bg-blue-400" : "bg-red-400";
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="md:text-2xl">
                      {" "}
                      {icon} {item.matiere}
                    </span>{" "}
                    <span className="md:text-2xl">{item.Pourcent}%</span>
                  </div>
                  <div className="bg-gray-200 w-full rounded-4xl h-2 md:h-5">
                    <div
                      style={{ width: `${item.Pourcent}%` }}
                      className={`${bg}  rounded-4xl h-2 md:h-5`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
