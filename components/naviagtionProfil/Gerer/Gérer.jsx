import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast, Toaster } from "sonner";
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
        <section className="bg-white w-full md:gap-10 md:grid px-3 py-4 mb-8 rounded-2xl">
          <span className="font-bold md:text-5xl">📁 Gérer vos exercices</span>
          {/* option 1 */}
          <div className="grid gap-3">
            <div className="space-y-1 grid md:gap-4 ">
              <span className="md:text-2xl md:font-extrabold">Classe</span>
              <select
                className=" md:p-8 md:rounded-3xl md:text-2xl md:font-bold w-full border border-gray-100 rounded-md outline-none  p-2"
                name=""
                id=""
                onChange={(e) => {
                  setOption1(e.target.value);
                }}
                value={option1}
              >
                <option className="" value="">
                  Sélectionner une classe
                </option>
                {Classes?.map((item, index) => {
                  return (
                    <option key={index} value={item.nom}>
                      {item.nom}{" "}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* option 2 */}

            {option1 && (
              <div className="grid gap-3">
                <span className="md:text-2xl md:font-extrabold">Chapitre</span>
                <select
                  className=" md:p-8 md:rounded-3xl md:text-2xl md:font-bold w-full border border-gray-100 rounded-md outline-none  p-2"
                  name=""
                  id=""
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
                  <option value="">Selection un capitre</option>
                  {Chapitre?.map((item, index) => {
                    return (
                      <option key={index} value={item.ordre}>
                        {item.titre} (
                        {`${item.title.Mathématiques} || ${item.title.Français}`}
                        )
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* option 3 */}

            {option2 && (
              <div className="grid gap-3">
                <span className="md:text-2xl md:font-extrabold">Matière</span>
                <select
                  className=" md:p-8 md:rounded-3xl md:text-2xl md:font-bold w-full border border-gray-100 rounded-md outline-none  p-2"
                  name=""
                  id=""
                  onChange={(e) => {
                    setOption3(e.target.value);
                  }}
                  value={option3}
                >
                  <option value="">Selectionner une matière</option>
                  {newMatiere?.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}{" "}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          <div className="grid space-y-4 mt-8">
            {option3 && (
              <div className="p-2 grid gap-3 bg-gray-200 rounded-md">
                <span className="font-bold md:text-3xl">
                  {option1} - {Descrip[option3]}
                </span>
                <span className="text-gray-400 text-sm">
                  {/* Apprendre à compter et reconnaitre les chiffres */}
                </span>
              </div>
            )}

            {option3 && (
              <div className="grid gap-2 overflow-auto md:h-200 h-50 p-4 border border-blue-600 rounded-2xl">
                {exercices?.length !== 0
                  ? exercices?.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-400 p-2 md:px-3 md:py-0 md:rounded-3xl md:border-4 rounded-md grid md:gap-0 gap-2"
                        >
                          <div className="flex gap-4 text-center md:justify-items-start items-center ">
                            <div className="flex gap-2 ">
                              <span className="md:text-2xl md:font-bold md:px-4 md:rounded-full bg-blue-300 text-blue-500 whitespace-nowrap inline-block rounded-4xl px-1 py-1">
                                Exercice {index + 1}
                              </span>
                              <span className="md:text-2xl md:font-bold md:px-4 md:rounded-full bg-green-300 text-green-500 rounded-4xl flex items-center justify-center px-1.5  p whitespace-nowrap ">
                                {item.type}
                              </span>
                            </div>
                            <div className="md:text-2xl flex gap-4 justify-center">
                              <button
                                onClick={() => {
                                  créerExercice(item);
                                  setModal(true);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                className="md:text-2xl"
                                onClick={() => {
                                  DeletedExercice(item.idExo, item.id);
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div className="grid gap-2 md:gap-0 ">
                            <span className="font-bold md:text-2xl">
                              {item.question}
                            </span>
                            <span className="md:text-2xl">
                              ✅ {item.result[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  : option3 && (
                      <div className="md:text-4xl md:text-center">
                        Aucun exercice pour la matière {option3}{" "}
                      </div>
                    )}
              </div>
            )}
          </div>

          {/* exemple a faire */}
          {!option3 && (
            <div className="mt-20">
              <div className=" grid justify-center items-center text-center gap-4 mb-8">
                <span className="text-4xl md:text-6xl">🎯</span>
                <span className=" font-bold md:text-5xl">
                  Sélectionnez une classe, un chapitre , une matière
                </span>
                <span className="text-sm text-gray-500 md:text-4xl">
                  Utilisez les filtres ci-dessus pour voir les exercices
                </span>
              </div>
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
