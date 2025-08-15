import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useContext, useState } from "react";
import { toast } from "sonner";
import { ApplicationContext } from "../../../context/ApplicationContextProvider";

export default function Supprimer() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { uid } = useContext(ApplicationContext);
  const [open, setOpen] = useState(null);

  // 🔧 AJOUT: Accès au client React Query pour nettoyer le cache
  const queryClient = useQueryClient();

  const toggle = (doc) => setOpen((prev) => (prev === doc ? null : doc));

  const {
    isPending,
    error,
    data,
    refetch: refetchClasse,
  } = useQuery({
    queryKey: ["repoData"],
    // 🔧 AMÉLIORATION: Désactiver le cache stale pour avoir des données fraîches
    staleTime: 0,
    cacheTime: 0,
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
    // 🔧 AMÉLIORATION: Désactiver le cache pour les chapitres aussi
    staleTime: 0,
    cacheTime: 0,
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

  const deletedClasse = async (classeName) => {
    if (!uid) {
      throw new Error("UID manquant");
    }
    try {
      const r = await fetch(`${url}/api/deleted/deleteclasse`, {
        method: "POST", // 🔧 CORRECTION: POST en majuscules
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, classe: classeName.toString() }),
      });
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.message || "Erreur inconnue");
      }

      toast.warning(data.message);

      // 🔧 AMÉLIORATION: Nettoyer TOUT le cache React Query
      await queryClient.invalidateQueries({ queryKey: ["repoData"] });
      await queryClient.invalidateQueries({ queryKey: ["chapitre"] });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deletedChapitre = async (classeName, chapitreName) => {
    if (!uid) {
      throw new Error("UID manquant");
    }
    try {
      // 🔧 AMÉLIORATION: Update optimiste - supprimer immédiatement de l'interface
      queryClient.setQueryData(
        ["chapitre", uid, NameClasse.length > 0],
        (oldData) => {
          if (!oldData?.table) return oldData;

          return {
            ...oldData,
            table: oldData.table.filter((item) => item.id !== chapitreName),
          };
        }
      );

      const r = await fetch(`${url}/api/deleted/deletechapitre`, {
        method: "POST", // 🔧 CORRECTION: POST en majuscules
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          classe: classeName.toString(),
          chapitre: chapitreName.toString(),
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        // 🔧 Si l'API échoue, restaurer les données
        await queryClient.invalidateQueries({ queryKey: ["chapitre"] });
        throw new Error(data.message || "Erreur inconnue");
      }

      toast.warning(data.message);

      // 🔧 AMÉLIORATION: Force le refetch depuis le serveur
      await queryClient.invalidateQueries({
        queryKey: ["chapitre"],
        exact: false,
      });

      // 🔧 AMÉLIORATION: Attendre un peu et refetch encore (au cas où)
      setTimeout(async () => {
        await refetchChapitre();
      }, 1000);
    } catch (error) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  return (
    <div>
      <main className="grid space-y-4 bg-white rounded-lg px-3 py-8 shadow-lg md:rounded-3xl">
        {Classe?.length === 0 ? (
          <div className="text-center md:text-4xl">
            Aucun élément à supprimer ! 🗑️
          </div>
        ) : (
          <section className="space-y-2 grid">
            <span className="font-bold md:text-4xl ">
              🗑️ Supprimer du contenu
            </span>

            <div className="p-2 md:p-8 grid gap-2 border border-red-400 bg-red-200 rounded-lg">
              <span className="font-bold text-red-500 md:text-3xl">
                {" "}
                ⚠️ Attention
              </span>
              <span className="text-sm md:text-2xl">
                La suppression est définitive et ne peut pas être annulée.
              </span>
            </div>
          </section>
        )}

        <section className="grid gap-4">
          {Classe.map((item, index) => {
            const chapitresParClasse = (chapitre || []).reduce((acc, item) => {
              const classeKey = item?.classe?.toUpperCase();
              if (!acc[classeKey]) acc[classeKey] = [];
              acc[classeKey].push(item);
              return acc;
            }, {});

            const taile = chapitresParClasse[item?.id]
              ? chapitresParClasse[item?.id].length
              : 0;

            return (
              <div
                key={index}
                className="rounded-lg border border-gray-400 md:border-4"
              >
                <div className="bg-gray-200 flex justify-between rounded-t-lg border-b-1 border-b-gray-500 md:p-8  px-3 py-3 ">
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-circle md:p-8 md:text-2xl md:font-semibold ${item.Color} text-white`}
                    >
                      {item.nom[0]}
                    </button>
                    <div className="grid">
                      <span className="font-bold md:text-3xl">{item.nom}</span>
                      <span className="text-sm md:text-2xl">
                        {item.Descrip} {taile} chapitre
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deletedClasse(item.nom);
                    }}
                    className="btn btn-error md:p-8 rounded-3xl md:rounded-full md:text-2xl text-white"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
                <div className="bg-white px-4 rounded-b-lg p-4">
                  <div
                    onClick={() => {
                      toggle(item.Ident);
                    }}
                    className="bg-gray-200 cursor-pointer rounded-lg px-4 md:p-6 py-2 flex justify-between "
                  >
                    <span className="md:text-2xl md:font-semibold">
                      📖 Gérer les chapitres ({taile}){" "}
                    </span>
                    <span>{open && open === item.Ident ? "🔽" : "▶️"}</span>
                  </div>
                  {/* les exercices a supprimer */}
                  {open === item.Ident && (
                    <div className="border border-gray-400 cursor-pointer p-2 md:p-6 grid gap-2 md:gap-4 mt-4 rounded-lg ">
                      {chapitresParClasse[item?.id]?.map((itemChap, index) => {
                        return (
                          <div
                            key={index}
                            className="flex justify-between md:px-5 px-3 p-2 items-center bg-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <span className="md:text-3xl">📊</span>
                              <div className="grid">
                                <span className="font-bold text-sm md:text-3xl">
                                  {itemChap.titre}
                                </span>
                                <span className="text-sm md:text-3xl text-gray-700 whitespace-nowrap overflow-auto ">
                                  Math: {itemChap.title.Mathématiques} Et Fran:{" "}
                                  {itemChap.title.Français}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                deletedChapitre(item.nom, itemChap.id)
                              }
                              className="text-sm p-1 bg-red-600 md:p-2 md:text-2xl md:px-4 md:rounded-full rounded-lg  text-white"
                            >
                              {" "}
                              supprimer
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
