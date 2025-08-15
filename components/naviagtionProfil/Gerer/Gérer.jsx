import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { ApplicationContext } from "../../../context/ApplicationContextProvider";

export default function Gérer() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  // const classe = [{ classe: "CP1" }, { classe: "CP2" }];
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

  const chapitre = [
    { chapitre: "Les nombre de 0 à 10" },
    { chapitre: "L'alphabet" },
    { chapitre: "Addition simple" },
  ];
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [Descrip, setDescrip] = useState("");
  const [OptionTypes, setOptionType] = useState([
    {
      id: "",
      idExo: "",
      type: "",
      question: "",
      options: ["", "", "", ""],
      result: "",
      explication: "",
    },
  ]);

  const [Modal, setModal] = useState(false);

  const onChangeType = (index, field, value) => {
    setOptionType((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
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

  const {
    isPending: isPenExo,
    error: ErrorExo,
    data: DataExo,
    refetch,
  } = useQuery({
    queryKey: ["Exo", uid, option1, option2, option3],
    enabled: !!uid && !!option1 && !!option2 && !!option3,
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getexercices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          classe: option1,
          matiere: option3,
          chapitre: option2,
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Erreur inconnue");
      return res.json();
    },
  });

  const DeletedExercice = async (numChap, index) => {
    const body = {
      uid: uid,
      classe: option1,
      chapitres: option2,
      matieres: option3,
      num: numChap,
      idExo: index,
    };
    try {
      const r = await fetch(`${url}/api/deleted/deleteExo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) {
        throw new Error(
          "Erreur lors de la suppressions !",
          toast.error(data.message)
        );
      }
      refetch();

      toast.warning(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const créerExercice = (data) => {
    // console.log("data.options", data.op);

    if (data) {
      const body = {
        id: data.id || "",
        idExo: data.idExo,
        type: data.type || "",
        question: data.question || "",
        options: data.option || ["", "", "", ""],
        result: Array.isArray(data.result)
          ? data.result[0] || ""
          : data.result || "", // ✅ string forcée

        explication: data.explication || "",
      };
      setOptionType([body]);
    }
  };

  const Edited = async () => {
    if (OptionTypes.length === 0) return;

    const doc = OptionTypes[0]; // on prend le seul élément à éditer

    const body = {
      uid: uid,
      classe: option1,
      chapitres: option2,
      matieres: option3,
      num: doc.idExo,
      idExo: doc.id,
      option: doc.options,
      question: doc.question,
      result: doc.result,
      type: doc.type,
      explication: doc.explication,
    };

    try {
      const r = await fetch(`${url}/api/edited/editeExo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) {
        toast.error(data.message);
      }

      console.log(data.message);
      toast.success(data.message);
      refetch();
    } catch (error) {
      toast.error(data.message);
    }
  };

  // const Matiere = [{ matiere: "mathématique" }, { matiere: "français" }];
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

  const Classes = data?.table || [];
  const Chapitre = dataChapitre?.table || [];
  const Matiere = dataChapitre?.table || [];

  const exercices = DataExo?.table || [];
  const Mat = dataMatiere?.table || [];

  const newMat = Mat?.find((item) => item.ordre === Number(option2));
  // console.log("DataExo :", DataExo?.table);

  const newMatiere = newMat?.nom || [];

  // console.log(ValueEdite);

  return (
    <div>
      <main>
        <section className="bg-white w-full px-3 py-4 mb-8 rounded-2xl sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-6 md:mb-8">
            📁 Gérer vos exercices
          </h1>

          {/* Conteneur principal des filtres */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Option 1 - Classe */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-base sm:text-lg md:text-xl lg:text-2xl font-bold sm:font-extrabold text-gray-800">
                Classe
              </label>
              <select
                className="w-full p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 
                   text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                   font-medium sm:font-semibold md:font-bold
                   border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
                   outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white shadow-sm hover:shadow-md transition-shadow"
                onChange={(e) => {
                  setOption1(e.target.value);
                }}
                value={option1}
              >
                <option value="">Sélectionner une classe</option>
                {Classes?.map((item, index) => (
                  <option key={index} value={item.nom}>
                    {item.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Option 2 - Chapitre */}
            {option1 && (
              <div className="space-y-2 sm:space-y-3 animate-fadeIn">
                <label className="block text-base sm:text-lg md:text-xl lg:text-2xl font-bold sm:font-extrabold text-gray-800">
                  Chapitre
                </label>
                <select
                  className="w-full p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 
                     text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                     font-medium sm:font-semibold md:font-bold
                     border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
                     outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white shadow-sm hover:shadow-md transition-shadow"
                  onChange={(e) => {
                    setOption2(e.target.value);
                    const selectedOption = Chapitre?.find(
                      (item) => item.ordre.toString() === e.target.value
                    );
                    if (selectedOption) {
                      setDescrip(selectedOption?.title);
                    }
                  }}
                  value={option2}
                >
                  <option value="">Sélectionner un chapitre</option>
                  {Chapitre?.map((item, index) => (
                    <option key={index} value={item.ordre}>
                      {item.titre} (
                      {`${item.title.Mathématiques} || ${item.title.Français}`})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Option 3 - Matière */}
            {option2 && (
              <div className="space-y-2 sm:space-y-3 animate-fadeIn">
                <label className="block text-base sm:text-lg md:text-xl lg:text-2xl font-bold sm:font-extrabold text-gray-800">
                  Matière
                </label>
                <select
                  className="w-full p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 
                     text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                     font-medium sm:font-semibold md:font-bold
                     border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
                     outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white shadow-sm hover:shadow-md transition-shadow"
                  onChange={(e) => {
                    setOption3(e.target.value);
                  }}
                  value={option3}
                >
                  <option value="">Sélectionner une matière</option>
                  {newMatiere?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section des résultats */}
          <div className="mt-6 sm:mt-8 space-y-4">
            {/* Titre de la matière sélectionnée */}
            {option3 && (
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg sm:rounded-xl animate-fadeIn">
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800">
                  {option1} - {Descrip[option3]}
                </h2>
              </div>
            )}

            {/* Liste des exercices */}
            {option3 && (
              <div className="border-2 border-blue-600 rounded-xl sm:rounded-2xl overflow-hidden animate-fadeIn">
                <div className="max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 xl:max-h-[500px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {exercices?.length !== 0 ? (
                    exercices?.map((item, index) => (
                      <div
                        key={item.id}
                        className="border-2 sm:border-3 md:border-4 border-gray-300 p-3 sm:p-4 
                           rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl
                           hover:shadow-md transition-shadow bg-white"
                      >
                        {/* Header de l'exercice */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
                          <div className="flex flex-wrap gap-2">
                            <span
                              className="bg-blue-100 text-blue-600 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                                   rounded-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 
                                   font-medium sm:font-semibold md:font-bold whitespace-nowrap"
                            >
                              Exercice {index + 1}
                            </span>
                            <span
                              className="bg-green-100 text-green-600 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                                   rounded-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 
                                   font-medium sm:font-semibold md:font-bold whitespace-nowrap"
                            >
                              {item.type}
                            </span>
                          </div>

                          {/* Boutons d'action */}
                          <div className="flex gap-2 sm:gap-3 justify-end sm:justify-start">
                            <button
                              onClick={() => {
                                créerExercice(item);
                                setModal(true);
                              }}
                              className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors
                               text-lg sm:text-xl md:text-2xl"
                              aria-label="Modifier l'exercice"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                DeletedExercice(item.idExo, item.id);
                              }}
                              className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors
                               text-lg sm:text-xl md:text-2xl"
                              aria-label="Supprimer l'exercice"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Contenu de l'exercice */}
                        <div className="space-y-2">
                          <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-800">
                            {item.question}
                          </p>
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-green-600 font-medium">
                            ✅ {item.result[0]}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500">
                        Aucun exercice pour la matière {option3}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Message d'instruction par défaut */}
          {!option3 && (
            <div className="mt-12 sm:mt-16 md:mt-20 text-center space-y-4 sm:space-y-6">
              <div className="text-4xl sm:text-5xl md:text-6xl">🎯</div>
              <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-800">
                Sélectionnez une classe, un chapitre, une matière
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-500">
                Utilisez les filtres ci-dessus pour voir les exercices
              </p>
            </div>
          )}
        </section>
        {Modal && (
          <section className=" bg-black/50  px-3 fixed top-0 left-0 h-screen w-screen grid  md:justify-center items-center">
            {OptionTypes.map((val, ind) => {
              return (
                <div
                  key={ind}
                  className="bg-white rounded-2xl md:rounded-3xl md:py-8 px-3 py-4 grid gap-4 md:w-300 md:px-10 md:h-auto "
                >
                  <div className="flex justify-between items-center md:text-5xl md:font-bold">
                    <span>✏️ Modifier l'exercice</span>
                    <span
                      onClick={() => {
                        setModal(false);
                      }}
                      className="font-bold cursor-pointer text-lg md:text-5xl"
                    >
                      ×
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {/* select choix */}
                    <label className="grid gap-2" htmlFor="">
                      <span className="md:text-2xl">Type d'exercice</span>
                      <select
                        value={val.type}
                        onChange={(e) =>
                          onChangeType(ind, "type", e.target.value)
                        }
                        className="md:p-4 cursor-pointer md:font-semibold md:rounded-2xl md:text-2xl border  outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                        name=""
                        id=""
                      >
                        {TypeExo.map((item, index) => {
                          return (
                            <option key={index} value={item.type}>
                              {" "}
                              {item.type}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  </div>

                  {/* input question*/}
                  <label className="grid gap-2" htmlFor="">
                    <span className="md:text-2xl">Question</span>
                    <input
                      onChange={(e) =>
                        onChangeType(ind, "question", e.target.value)
                      }
                      value={val.question}
                      placeholder="Ecris ta question ici..."
                      type="text"
                      className="md:p-4 md:font-semibold md:rounded-2xl md:text-2xl border  outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                    />
                  </label>
                  {/* Option de reponse */}

                  {val.type === "choix multiple" && (
                    <label className="grid gap-2" htmlFor="">
                      <span className="md:text-2xl">Option de reponse</span>

                      {val?.options?.map((item, index) => {
                        return (
                          <input
                            key={index}
                            onChange={(e) => {
                              const newOption = [...val.options];
                              newOption[index] = e.target.value;

                              onChangeType(ind, "options", newOption);
                            }}
                            placeholder={`Option ${index + 1}`}
                            value={item}
                            type="text"
                            className=" md:p-4 md:font-semibold md:rounded-2xl md:text-2xl border  outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                          />
                        );
                      })}
                    </label>
                  )}
                  {/* Reponse Options */}
                  {val.type === "choix multiple" && (
                    <div>
                      <span className="md:text-2xl">Réponse correcte</span>
                      <select
                        onChange={(e) =>
                          onChangeType(ind, "result", e.target.value)
                        }
                        value={val.result}
                        className="border cursor-pointer md:p-4 md:font-semibold md:rounded-2xl md:text-2xl outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                        name=""
                        id=""
                      >
                        {val?.options?.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Réponse correcte*/}

                  {val.type === "Réponse libre" && (
                    <div>
                      <span className="md:text-2xl">Réponse correcte</span>
                      <input
                        placeholder="Réponse correcte"
                        onChange={(e) =>
                          onChangeType(ind, "result", e.target.value)
                        }
                        value={val.result}
                        type="text"
                        className="border md:p-4 md:font-semibold md:rounded-2xl md:text-2xl  outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                      />
                    </div>
                  )}
                  {/* Reponse Vrai/faux */}
                  {val.type === "vrai/faux" && (
                    <div>
                      <span className="md:text-2xl">Réponse correcte</span>
                      <select
                        className="border cursor-pointer md:p-4 md:font-semibold md:rounded-2xl md:text-2xl outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                        name=""
                        id=""
                        onChange={(e) =>
                          onChangeType(ind, "result", e.target.value)
                        }
                        value={val.result}
                      >
                        {TypeBoolean.map((item, index) => {
                          return (
                            <option key={index} value={item.boolean}>
                              {" "}
                              {item.boolean}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Réponse vrai/faux*/}

                  {/* Explication*/}

                  <label className="grid gap-2" htmlFor="">
                    <span className="md:text-2xl">
                      Exlication de la Réponse
                    </span>

                    <textarea
                      onChange={(e) =>
                        onChangeType(ind, "explication", e.target.value)
                      }
                      value={val.explication}
                      name=""
                      id=""
                      placeholder="Explication de la réponse..."
                      className="border md:p-4 md:font-semibold md:rounded-2xl md:text-2xl outline-violet-500 border-gray-500 p-1 rounded-md w-full"
                    ></textarea>
                  </label>

                  <div className="border-t border-gray-400 grid gap-2 pt-4">
                    <button
                      onClick={() => {
                        Edited();
                      }}
                      className="bg-green-500 cursor-pointer text-white p-2 md:p-4 md:text-2xl md:font-semibold rounded-md text-center"
                    >
                      💾 Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setModal(false);
                      }}
                      className="bg-gray-500 cursor-pointer text-white p-2 md:p-4 md:text-2xl md:font-semibold rounded-md text-center"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
