import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../../../context/ApplicationContextProvider";

export default function Activité() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  const [act, setAct] = useState(null);
  const { uid } = useContext(ApplicationContext);
  const {
    isPending,
    error,
    data,
    refetch: refetchClasse,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      if (!uid) {
        throw new Error("UID manquant");
      }
      const res = await fetch(`${url}/api/getclasse/get`, {
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
  });

  const NameClasse = (data?.table || []).map((item) => item.id);
  const {
    isPending: isPenChapitre,
    error: errorChapitre,
    data: dataChapitre,
    refetch: refetchChapitre,
  } = useQuery({
    queryKey: ["chapitre", uid, NameClasse.length > 0],
    enabled: !!uid && !!NameClasse,
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getchapitresupprime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, classe: NameClasse }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur inconnue");
      }
      return res.json();
    },
  });

  if (isPending) {
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
  if (error) return "Erreur : " + error.message;

  const Classe = data?.table || [];
  const chapitre = dataChapitre?.table;
  const activiRecent = chapitre?.filter(
    (item) => item.Français || item.Mathématiques
  );

  const datScore = (data) => {
    return data?.flatMap((item) => {
      return Object.keys(item)
        .filter((k) => typeof item[k] === "object" && "score" in item[k])
        .map((matiere) => {
          const infos = item[matiere];
          return {
            matiere,
            score: infos.score,
            Date: infos.ActiveDate || 0,
            titre: item.title?.[matiere] || "",
            length: infos.length,
          };
        });
    });
  };
  const ScoreDate = datScore(activiRecent);

  function DateDay() {
    const toDay = new Date();
    const jour = String(toDay.getDate()).padStart(2, "0");
    const mois = String(toDay.getMonth() + 1).padStart(2, "0");
    const annee = toDay.getFullYear();

    return `${jour}/${mois}/${annee}`;
  }
  const dataDuJour = DateDay();

  const Activite = ScoreDate?.filter((item) => item.Date === dataDuJour);
  const TableActiviter = [];
  // console.log([Activite]);

  return (
    <main>
      <section className="bg-white px-3 grid gap-4 rounded-2xl shadow-lg py-4 mb-8 md:px-15">
        <span className="font-bold md:text-4xl">Activité récente</span>

        <div className="grid gap-4 ">
          {Activite === undefined || Activite.length === 0 ? (
            <div className="md:text-4xl text-center grid">
              Aucune activer aujourd'hui
            </div>
          ) : (
            Activite?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-gray-50 flex text-sm items-center  gap-2 md:py-8 md:px-5 md:rounded-3xl w-full  rounded-md p-2"
                >
                  <span className="mx-1 md:text-4xl">✅</span>
                  <div className="w-full flex items-center justify-between">
                    <div className=" flex text-left flex-col ">
                      <span className=" whitespace-nowrap overflow-hidden text-ellipsis w-50 md:w-full md:text-4xl md:whitespace-normal ">
                        {item.titre[item.matiere]}
                      </span>
                      <span className="text-gray-400 text-sm md:text-3xl">
                        {item.matiere}
                      </span>
                    </div>
                    <div className="flex flex-col text-right ">
                      <span className="font-bold text-green-500 md:text-3xl">
                        {item.score}/{item.length}
                      </span>
                      <span className="text-gray-400 text-sm md:text-2xl">
                        {item.Date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/*  */}
        </div>
      </section>
    </main>
  );
}
