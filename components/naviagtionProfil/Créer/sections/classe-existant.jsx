import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApplicationContext } from "../../../../context/ApplicationContextProvider";

export default function Classe_existant({ button }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { uid } = useContext(ApplicationContext);
  const TypeExo = [
    { type: "choix multiple" },
    { type: "Réponse libre" },
    { type: "vrai/faux" },
  ];

  const TypeOp = [
    { opt: "option 1" },
    { opt: "option 2" },
    { opt: "option 3" },
    { opt: "option 4" },
  ];

  const TypeBoolean = [{ boolean: "vrai" }, { boolean: "faux" }];

  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [addExercices, setAddExercices] = useState(true);
  const [affiche, setAffiche] = useState(false);
  const [Exercices, setExercices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const exerciceHeaderRef = useRef(null);

  const ajoute_Exeo = () => {
    setExercices((prev) => [
      ...prev,
      {
        id: Date.now(),
        Type: "choix multiple",
        Question: "",
        option: "",
        Reponse: ["", "", "", ""],
        ReponseCorrecte: "",
        Explication: "",
      },
    ]);
  };

  const closeExo = (id) => {
    setExercices((prev) => prev.filter((item) => item.id !== id));
  };

  const { isPending, error, data } = useQuery({
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

  const {
    isPending: isPenChapitre,
    error: errorChapitre,
    data: dataChapitre,
  } = useQuery({
    queryKey: ["chapitre", uid, option1],
    enabled: !!uid && !!option1,
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getchapitre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, classe: option1 }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur inconnue");
      }
      return res.json();
    },
  });

  const {
    isPending: isPenMatiere,
    error: errorMatiere,
    data: dataMatiere,
  } = useQuery({
    queryKey: ["score", uid, option1],
    enabled: !!uid && !!option1,
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getscore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          classe: option1,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur inconnue");
      }
      return res.json();
    },
  });

  const handleTypeChange = (newType, exoId) => {
    setExercices((prev) =>
      prev.map((item) => {
        if (item.id === exoId) {
          switch (newType) {
            case "choix multiple":
              return {
                ...item,
                Type: newType,
                Reponse: ["", "", "", ""],
                ReponseCorrecte: "",
              };
            case "Réponse libre":
              return {
                ...item,
                Type: newType,
                Reponse: "",
                ReponseCorrecte: "",
              };
            case "vrai/faux":
              return {
                ...item,
                Type: newType,
                Reponse: "",
                ReponseCorrecte: "",
              };
            default:
              return item;
          }
        }
        return item;
      })
    );
  };

  const updateMultipleChoiceOption = (exoId, optionIndex, newValue) => {
    setExercices((prev) =>
      prev.map((ex) => {
        if (ex.id === exoId) {
          const newReponses = [...(ex.Reponse || ["", "", "", ""])];
          newReponses[optionIndex] = newValue;
          return { ...ex, Reponse: newReponses };
        }
        return ex;
      })
    );
  };

  const updateExerciceField = (exoId, field, value) => {
    setExercices((prev) =>
      prev.map((item) =>
        item.id === exoId ? { ...item, [field]: value } : item
      )
    );
  };

  const addExercice = async () => {
    try {
      // Vérification qu'il y a au moins un exercice
      if (Exercices.length === 0) {
        alert("Veuillez créer au moins un exercice avant d'enregistrer !");
        toast.warning(
          "Veuillez créer au moins un exercice avant d'enregistrer !"
        );
        return;
      }

      // Vérification AVANT tout envoi - CORRIGÉE
      const hasEmptyField = Exercices.some((exercice, index) => {
        // Vérification des champs de base
        if (!exercice.Question?.toString().trim()) {
          toast.error(
            `Exercice ${
              index + 1
            }: Question vide . Tous les champs sont obligatoires !`
          );
          return true;
        }

        if (!exercice.Type?.toString().trim()) {
          console.log();
          toast.error(
            `Exercice ${
              index + 1
            }: Type vide . Tous les champs sont obligatoires !`
          );
          return true;
        }

        if (!exercice.ReponseCorrecte?.toString().trim()) {
          toast.error(
            `Exercice ${
              index + 1
            }: Réponse correcte vide . Tous les champs sont obligatoires !`
          );
          return true;
        }

        if (!exercice.Explication?.toString().trim()) {
          console.log();
          toast.error(
            `Exercice ${
              index + 1
            }: Explication vide . Tous les champs sont obligatoires !`
          );
          return true;
        }

        // Vérification spécifique pour les choix multiples
        if (exercice.Type === "choix multiple") {
          if (!Array.isArray(exercice.Reponse)) {
            toast.error(
              `Exercice ${
                index + 1
              }: Réponses pas un tableau . Tous les champs sont obligatoires !`
            );
            return true;
          }

          // Vérifier que toutes les options sont remplies
          const hasEmptyOptions = exercice.Reponse.some(
            (option) => !option?.toString().trim()
          );
          if (hasEmptyOptions) {
            toast.error(
              `Exercice ${
                index + 1
              }: Options vides . Tous les champs sont obligatoires !`
            );
            return true;
          }
        }

        return false;
      });

      if (hasEmptyField) {
        // alert("Veuillez remplir tous les champs obligatoires !");
        // toast.warning("Veuillez remplir tous les champs obligatoires !");
        return; // On stoppe TOUT ici
      }

      // Si tout est OK, on lance l'envoi
      setIsLoading(true);

      for (let exercice of Exercices) {
        const payload = {
          uid,
          classe: option1,
          chapitres: option2,
          matieres: option3,
          id: exercice.id,
          title: option2,
          question: exercice.Question,
          option: exercice.Type === "choix multiple" ? exercice.Reponse : [],
          result: exercice.ReponseCorrecte,
          type: exercice.Type, // Utiliser Type avec majuscule
          explication: exercice.Explication,
        };

        const r = await fetch(`${url}/api/addclasse/addexercices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await r.json();
        toast.success(data.message);
      }

      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (exerciceHeaderRef.current) {
        const { top } = exerciceHeaderRef.current.getBoundingClientRect();
        setShowFixedButton(top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const Classe = data?.table;
  const Chapitre = dataChapitre?.table;
  const mat = dataMatiere?.table;
  const newMat = mat?.find((item) => item.id === option2);
  const newTableMat = newMat ? [newMat] : [];

  const mets = newTableMat?.map((item) => item.nom);
  const plat = mets?.flat();
  const objetMat = plat?.map((item) => ({ matiere: item }));

  // Créer une liste unique des chapitres (éviter les doublons d'ID)
  const uniqueChapitres =
    Chapitre?.reduce((acc, item) => {
      // Si l'ID n'existe pas déjà, on l'ajoute
      if (!acc.find((existing) => existing.id === item.id)) {
        // Combiner tous les titres de matières pour cet ID
        const titlesArray = Object.entries(item.title).map(
          ([matiere, titre]) => `${matiere}: ${titre}`
        );
        const combinedTitle = titlesArray.join(" | ");

        acc.push({
          id: item.id,
          displayTitle: combinedTitle,
        });
      }
      return acc;
    }, []) || [];

  return (
    <main>
      {addExercices && (
        <section className="bg-white rounded-lg py-4 px-3 w-auto shadow-lg md:w-400 md:rounded-3xl">
          <div className="grid gap-4">
            <span className="text-lg font-bold md:text-4xl">
              📚 Sélectionner une classe existante
            </span>
            <label className="grid gap-2" htmlFor="">
              <span className="md:text-2xl md:font-semibold">Classe</span>
              <select
                className="border md:p-6 md:rounded-2xl md:text-2xl md:font-semibold cursor-pointer outline-violet-500 rounded-lg px-3 p-2 w-full"
                onChange={(e) => setOption1(e.target.value)}
                value={option1}
              >
                <option value="">Sélectionner une classe</option>
                {Classe?.map((item, index) => (
                  <option key={index} value={item.nom}>
                    {item.nom}
                  </option>
                ))}
              </select>
            </label>
            {option1 && (
              <label className="grid gap-2">
                <span className="md:text-2xl md:font-semibold">Chapitre</span>
                <select
                  className="border md:p-6 md:rounded-2xl md:text-2xl md:font-semibold cursor-pointer outline-violet-500 rounded-lg px-3 p-2 w-full"
                  onChange={(e) => setOption2(e.target.value)}
                  value={option2}
                >
                  <option value="">
                    {uniqueChapitres?.length === 0
                      ? "Aucun chapitre pour le moment"
                      : "Sélectionner un chapitre "}
                  </option>
                  {uniqueChapitres.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.displayTitle} ({item.id})
                    </option>
                  ))}
                </select>
              </label>
            )}

            {option2 && (
              <label className="grid gap-2" htmlFor="">
                <span className="md:text-2xl md:font-semibold">Matière</span>
                <select
                  className="border md:p-6 md:rounded-2xl md:text-2xl md:font-semibold cursor-pointer outline-violet-500 rounded-lg px-3 p-2 w-full"
                  onChange={(e) => setOption3(e.target.value)}
                  value={option3}
                >
                  <option value="">Sélectionner une matière</option>
                  {objetMat?.map((item, index) => (
                    <option key={index} value={item.matiere}>
                      {item.matiere}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="flex gap-4">
              <button
                onClick={button}
                className="bg-gray-700 md:text-3xl md:px-4 md:py-5 md:rounded-full text-white font-bold rounded-4xl px-3 p-2"
              >
                ← Retour
              </button>
              {option3 && (
                <button
                  onClick={() => {
                    setAddExercices(false);
                    setAffiche(true);
                  }}
                  className="bg-violet-700 cursor-pointer md:text-3xl md:px-4 md:py-5 md:rounded-full text-white font-bold rounded-4xl px-3 p-2"
                >
                  Ajouter exercices
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {affiche && (
        <section className="bg-white px-3 rounded-lg shadow-lg py-4 grid gap-4 md:w-400 md:py-8 md:px-10 md:rounded-3xl">
          <div
            className="flex items-center gap-4 md:justify-between"
            ref={exerciceHeaderRef}
          >
            <span className="md:text-3xl md:font-semibold">
              ❓ Créer des exercices
            </span>
            <button
              onClick={ajoute_Exeo}
              className="bg-green-500 rounded-2xl cursor-pointer md:text-3xl md:font-semibold md:rounded-2xl p-2 text-sm text-white  md:px-3"
            >
              + Ajouter un exercice
            </button>
          </div>

          {Exercices.length <= 0 ? (
            <section>
              <div className="grid gap-2 text-center border border-dashed md:border-4 md:border-gray-400 rounded-md p-2 md:py-25">
                <span className="text-2xl md:text-5xl">❓</span>
                <span className="font-bold md:text-5xl text-gray-400">
                  Aucun exercice créé
                </span>
                <span className="text-sm md:text-4xl text-gray-400">
                  Cliquez sur "Ajouter un exercice" pour commencer
                </span>
              </div>
            </section>
          ) : (
            <div className="grid gap-4">
              {Exercices.map((exo, index) => (
                <div
                  key={exo.id}
                  className="border border-gray-300 rounded-lg px-3 py-3 grid gap-4 md:rounded-3xl md:py-5 md:px-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="md:text-2xl md:font-semibold">
                      Exercice {index + 1}
                    </span>
                    <button
                      onClick={() => closeExo(exo.id)}
                      className="text-red-500 hover:text-red-700 md:text-2xl md:font-semibold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <label className="md:grid gap-2">
                    <span className="md:text-2xl md:font-semibold">
                      Type d'exercice
                    </span>
                    <select
                      onChange={(e) => handleTypeChange(e.target.value, exo.id)}
                      value={exo.Type}
                      className="border md:py-4 md:text-2xl md:rounded-2xl md:font-semibold border-gray-300 outline-violet-500 rounded-lg p-2 px-3 w-full"
                    >
                      {TypeExo.map((item, index) => (
                        <option key={index} value={item.type}>
                          {item.type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="md:grid gap-2">
                    <span className="md:text-2xl md:font-semibold">
                      Question
                    </span>
                    <input
                      onChange={(e) =>
                        updateExerciceField(exo.id, "Question", e.target.value)
                      }
                      placeholder="Écris ta question ici..."
                      className="border md:py-4 md:text-2xl md:rounded-2xl md:font-semibold border-gray-300 outline-violet-500 rounded-lg p-2 px-3 w-full"
                      type="text"
                      value={exo.Question}
                    />
                  </label>
                  {exo.Type === "choix multiple" && (
                    <div className="md:grid gap-2 grid ">
                      <span className="md:text-2xl md:font-semibold">
                        Options de réponse
                      </span>
                      {TypeOp.map((item, optIndex) => (
                        <input
                          required
                          key={optIndex}
                          type="text"
                          placeholder={item.opt}
                          value={exo.Reponse[optIndex] || ""}
                          className="border  border-gray-300 md:py-4 md:text-2xl md:rounded-2xl md:font-semibold placeholder:text-gray-400 outline-violet-500 rounded-lg p-2 px-3 w-full"
                          onChange={(e) =>
                            updateMultipleChoiceOption(
                              exo.id,
                              optIndex,
                              e.target.value
                            )
                          }
                        />
                      ))}
                      <label className="md:grid gap-2">
                        <span className="md:text-2xl md:font-semibold">
                          Réponse correcte
                        </span>
                        <select
                          required
                          onChange={(e) =>
                            updateExerciceField(
                              exo.id,
                              "ReponseCorrecte",
                              e.target.value
                            )
                          }
                          value={exo.ReponseCorrecte}
                          className="border  border-gray-300 md:py-4 md:text-2xl md:rounded-2xl md:font-semibold outline-violet-500 rounded-lg p-2 px-3 w-full"
                        >
                          <option value="">
                            Sélectionner la bonne réponse
                          </option>
                          {exo.Reponse?.map(
                            (option, optIndex) =>
                              option.trim() !== "" && (
                                <option key={optIndex} value={option}>
                                  {option}
                                </option>
                              )
                          )}
                        </select>
                      </label>
                    </div>
                  )}
                  {exo.Type === "Réponse libre" && (
                    <label className="md:grid gap-2">
                      <span className="md:text-2xl md:font-semibold">
                        Réponse correcte
                      </span>
                      <input
                        required
                        onChange={(e) =>
                          updateExerciceField(
                            exo.id,
                            "ReponseCorrecte",
                            e.target.value
                          )
                        }
                        value={exo.ReponseCorrecte}
                        placeholder="Réponse correcte"
                        className="border border-gray-300 md:py-4 md:text-2xl md:rounded-2xl md:font-semibold outline-violet-500 rounded-lg p-2 px-3 w-full"
                        type="text"
                      />
                    </label>
                  )}
                  {exo.Type === "vrai/faux" && (
                    <label className="md:grid gap-2">
                      <span className="md:text-2xl md:font-semibold">
                        Réponse correcte
                      </span>
                      <select
                        required
                        onChange={(e) =>
                          updateExerciceField(
                            exo.id,
                            "ReponseCorrecte",
                            e.target.value
                          )
                        }
                        value={exo.ReponseCorrecte}
                        className="border border-gray-300 md:py-4 md:text-2xl md:rounded-2xl md:font-semibold outline-violet-500 rounded-lg p-2 px-3 w-full"
                      >
                        <option value="">Sélectionner...</option>
                        {TypeBoolean.map((item, index) => (
                          <option key={index} value={item.boolean}>
                            {item.boolean}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="md:grid gap-2">
                    <span className="md:text-2xl md:font-semibold">
                      Explication (optionnel)
                    </span>
                    <textarea
                      required
                      onChange={(e) =>
                        updateExerciceField(
                          exo.id,
                          "Explication",
                          e.target.value
                        )
                      }
                      value={exo.Explication}
                      placeholder="Explication de la réponse..."
                      className="border border-gray-300 md:py-6 md:text-2xl md:rounded-2xl md:font-semibold outline-violet-500 rounded-lg p-2 px-3 w-full"
                      rows="3"
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
          <div className="border-t-gray-300 md:flex md:justify-between md:border-t-4 md:mt-8 md:py-8 border-t p-2 px-3 grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => {
                setAddExercices(true);
                setAffiche(false);
              }}
              className="rounded-4xl md:text-3xl md:py-4 p-2 md:px-8 cursor-pointer bg-gray-500 text-white text-sm font-bold"
            >
              ← Retour
            </button>
            <div className="md:flex gap-4 flex">
              <button
                onClick={button}
                className="rounded-4xl md:text-3xl md:py-4 p-2 md:px-8 cursor-pointer bg-orange-500 text-white text-sm font-bold"
              >
                🔄 Recommencer
              </button>
              <button
                onClick={addExercice}
                disabled={isLoading}
                className={`rounded-4xl md:text-3xl md:py-4 p-2 md:px-8 cursor-pointer text-white text-sm font-bold ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isLoading ? "💾 Enregistrement..." : "💾 Enregistrer"}
              </button>
            </div>
          </div>
        </section>
      )}

      {affiche && showFixedButton && (
        <button
          onClick={ajoute_Exeo}
          className="fixed top-4 right-4 bg-green-500 p-2 text-white rounded-md shadow-lg hover:bg-green-600"
        >
          + Ajouter un exercice
        </button>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Enregistrement en cours...
              </h3>
              <p className="text-gray-600 text-sm">Veuillez patienter</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
