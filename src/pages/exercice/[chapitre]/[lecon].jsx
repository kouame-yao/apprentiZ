import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Wrapper from "../../../../components/Wrapper";
import { ApplicationContext } from "../../../../context/ApplicationContextProvider";
import { protectPage } from "../../../../lib/auth";

function lecon() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { uid } = useContext(ApplicationContext);
  const router = useRouter();
  const { classe, lecon, chapitre } = router.query;
  // console.log(classe, lecon, chapitre);
  // CP1 1 Français

  const [inputvalue, setinputValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [Next, setNext] = useState(true);
  const [score, setScore] = useState(0);
  const [info, setinfo] = useState(null);
  const [nextQuestio, setNextQuestion] = useState(0);
  const [resultaChapitre, setResultaChapitre] = useState(true);

  const booleen = [
    { id: 1, text: "vrai", icon: "✅" },
    { id: 2, text: "faux", icon: "❌" },
  ];

  const {
    isPending: isPenExo,
    error: ErrorExo,
    data: DataExo,
  } = useQuery({
    queryKey: ["Exo", uid, classe, chapitre, lecon],
    enabled: !!uid && !!classe && !!chapitre && !!lecon,
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/getexercices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          classe,
          matiere: chapitre,
          chapitre: lecon,
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Erreur inconnue");
      return res.json();
    },
  });

  const exercice = DataExo?.table || [];
  const snapUser = exercice[nextQuestio];
  const options = snapUser?.option;
  const nombreExo = exercice.length;
  const chapscore = nombreExo * 4;
  const pourcentage = ((nextQuestio + 1) / nombreExo) * 100;

  const editeActive = async (boolean) => {
    const body = {
      uid: uid,
      classe: classe,
      chapitres: lecon,
      matieres: chapitre,
      num: snapUser?.idExo,
      idExo: snapUser?.id,
      active: boolean,
    };
    try {
      const r = await fetch(`${url}/api/edited/editeactive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        throw new Error((await r.json().message) || "Erreur du serveur");
      }

      const data = await r.json();
      console.log(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const valide = () => {
    const text = textValue.toLowerCase().trim();
    const input = inputvalue.toLowerCase().trim();
    const result = snapUser.result.map((x) => x.trim().toLowerCase());

    const bonneReponse = result.includes(text) || result.includes(input);

    if (bonneReponse) {
      const NewScore = score + 4;
      setNext(false);

      setScore(NewScore);
      setinfo(true);
      editeActive(true);

      addScore(NewScore);
    } else {
      console.log("mauvaise reponse");
      setScore(0);

      // Ici tu ne veux pas remettre à zéro à chaque mauvaise réponse
      // Tu peux le faire seulement si c’est une nouvelle partie
      setinfo(false);
      editeActive(false);
      addScore(0);
    }
  };

  async function addScore(doc) {
    const res = await fetch(`${url}/api/addclasse/addscore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        classe,
        matiere: chapitre,
        chapitre: lecon,
        score: doc,
        length: chapscore,
      }),
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Erreur inconnue");
    return res.json();
  }

  // useEffect(() => {
  //   if (
  //     !resultaChapitre &&
  //     score > 0 &&
  //     uid &&
  //     classe &&
  //     chapitre &&
  //     lecon &&
  //     nombreExo > 0
  //   ) {
  //     addScore(score);
  //   }
  // }, [resultaChapitre]);

  const appreciationScore = (doc) => {
    if (doc == 0) return "Aucun effort visible.";
    if (doc == 4) return "C’est un début.";
    if (doc == 8) return "Quelques bonnes réponses.";
    if (doc == 12) return "Pas mal du tout !";
    if (doc == 16) return "Très bon travail !";
    if (doc >= 20) return "Excellent ! Bravo !";
  };

  const appreciationScoreicon = (doc) => {
    if (doc == 0) return "😞";
    if (doc == 4) return "😕";
    if (doc == 8) return "😐";
    if (doc == 12) return "🙂";
    if (doc == 16) return "😃";
    if (doc >= 20) return "🏆";
  };

  const question =
    nombreExo === nextQuestio + 1 ? "Voir mes résultats" : "Question suivante";
  const QuestionNextExerce = () => {
    if (nombreExo > nextQuestio + 1) setNextQuestion((prev) => prev + 1);
    else setResultaChapitre(false);
  };

  if (isPenExo) {
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
  if (ErrorExo) return `Erreur : ${ErrorExo.message}`;

  if (!nombreExo) {
    return (
      <Wrapper name={"Créer l'exercice"} button={"/ajouter-exercice"}>
        <div className="flex flex-col items-center justify-center h-[100vh] gap-4 p-8 px-3  bg-yellow-50 shadow-lg rounded-lg  text-center">
          <div className="text-5xl animate-pulse md:text-4xl">📚</div>

          <p className="text-lg text-gray-700 font-medium md:text-4xl">
            Aucun exercice n’est encore disponible pour le chapitre{" "}
            <strong>
              {lecon} {chapitre}
            </strong>
            .
          </p>

          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-transparent border cursor-pointer md:w-80 md:p-6 md:text-3xl shadow-info-content shadow text-gray-700 rounded-full hover:bg-violet-200 transition"
          >
            ← Retour
          </button>
        </div>
      </Wrapper>
    );
  }
  const icons =
    chapitre === "Mathématiques" ? `📊${chapitre}` : `📚${chapitre}`;
  return (
    <Wrapper name={icons} color={"bg-white"} textColor={"text-black"}>
      {resultaChapitre ? (
        <main className="px-4 space-y-18 grid place-items-center  ">
          {/* pourcentage */}
          {Next ? (
            <>
              <section className="md:w-[50%] w-full ">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>
                      Question {nextQuestio + 1} sur {nombreExo}
                    </span>{" "}
                    <span>{pourcentage.toFixed(0)}%</span>
                  </div>
                  <div className="bg-white h-2 md:h-4 rounded-4xl md:rounded-full ">
                    <div
                      className="bg-blue-600 h-2 md:h-4 rounded-4xl md:rounded-full "
                      style={{ width: `${pourcentage.toFixed(0)}%` }}
                    ></div>
                  </div>
                </div>
              </section>
              {/* partir du jeu   */}

              <section className="md:w-[50%] w-full ">
                <div className="">
                  <div className="bg-white shadow-lg md:scale-115 rounded-3xl py-10 md:w-[95%] w-full px-4 space-y-4 text-center">
                    {/* la question */}

                    <div className="grid gap-4 text-2xl md:text-5xl font-bold">
                      <span className="">{chapitre}</span>
                      <span>❓</span>
                      <span>{snapUser.question}</span>
                    </div>
                    {/* option  */}
                    {snapUser.type === "choix multiple" && (
                      <div className="grid gap-4 mt-4">
                        {options?.map((item, index) => {
                          const active =
                            item === textValue
                              ? "bg-blue-100 border-blue-500"
                              : "border-gray-300";
                          return (
                            <div
                              onClick={() => setTextValue(item)}
                              key={index}
                              className={`border rounded-md font-bold md:text-3xl cursor-pointer hover:bg-blue-100 hover:border-blue-300 px-3 py-5 ${active}`}
                            >
                              {item}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* booleen  */}
                    <div>
                      {snapUser.type === "vrai/faux" && (
                        <div className="flex space-x-3  justify-center items-center w-full">
                          {booleen.map((item) => {
                            const active =
                              item.text === textValue
                                ? "bg-blue-100 border-blue-500"
                                : "border-gray-300";
                            return (
                              <button
                                onClick={() => setTextValue(item.text)}
                                key={item.id}
                                className={`${active} border-2 w-full md:text-3xl md:rounded-2xl rounded-lg font-bold px-3 py-4 md:py-8`}
                              >
                                {item.icon} {item.text}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {/* input */}
                    <div>
                      {snapUser.type === "Réponse libre" && (
                        <div>
                          <input
                            value={inputvalue}
                            onChange={(e) => setinputValue(e.target.value)}
                            type="text"
                            placeholder="Ecris ta reponse ici..."
                            className="border outline-none  focus:border-blue-500 border-gray-300 rounded-md w-full px-3 py-4 placeholder:text-gray-300 placeholder:font-bold text-center md:border-2  md:text-3xl md:rounded-2xl  font-bold  md:py-8"
                          />
                        </div>
                      )}
                    </div>
                    {/* boutton */}

                    <div className="text-center grid justify-center">
                      <button
                        onClick={() => {
                          valide(),
                            setNext(false),
                            setTextValue(""),
                            setinputValue("");
                        }}
                        disabled={!(textValue || inputvalue)}
                        className={`${
                          textValue || inputvalue
                            ? "bg-blue-600 "
                            : "bg-gray-200"
                        } w-full py-2 px-5 rounded-full md:rounded-full md:px-8 md:text-3xl md:py-4 text-white font-bold`}
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="bg-white md:w-[50%] md:mt-45 shadow-lg md:min-h-[70vh] rounded-3xl py-10 w-full px-4 text-center flex flex-col justify-center">
                {/* Section titre/question - centrée */}
                <div className="flex-1 flex flex-col justify-center items-center md:gap-6 gap-2 text-2xl font-bold mb-8">
                  <span className="text-3xl md:text-7xl">{snapUser.title}</span>
                  <span className="text-4xl md:text-7xl">❓</span>
                  <span className="text-xl md:text-7xl leading-relaxed">
                    {snapUser.question}
                  </span>
                </div>

                {/* Section résultat - centrée */}
                <div className="flex-1 flex flex-col justify-center">
                  {info ? (
                    <div className="grid w-full justify-center items-center md:gap-6 gap-4">
                      <span className="text-7xl animate-bounce">🎉</span>
                      <div className="grid justify-center items-center md:text-5xl px-8 py-6 w-full max-w-md mx-auto text-green-600 rounded-2xl bg-green-100 shadow-inner">
                        <span className="font-bold text-xl mb-2">
                          Correct !
                        </span>
                        <span className="text-lg md:text-2xl  leading-relaxed">
                          {snapUser.infosucces}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid w-full justify-center items-center gap-6 md:scale-125">
                      <span className="text-7xl md:text-8xl animate-pulse">
                        😩
                      </span>
                      <div className="grid justify-center items-center md:text-5xl px-8 py-6 w-full max-w-md mx-auto text-red-600 rounded-2xl bg-red-100 shadow-inner">
                        <span className="font-bold text-xl mb-2">
                          Pas tout à fait...
                        </span>
                        <span className="text-lg md:text-2xl leading-relaxed">
                          {snapUser.infoErro}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton - en bas mais pas collé */}
                <div className="mt-8 md:mt-16">
                  <button
                    onClick={() => {
                      setNext(true), QuestionNextExerce();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-full px-8 py-4 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {question}
                  </button>
                </div>
              </div>
            </>
          )}
          <section className="grid justify-center items-center mb-10">
            <div
              onClick={() => router.push(`/classe/${classe}`)}
              className="py-2 md:text-3xl md:p-4 md:px-10 px-8  bg-gray-700 text-lg font-bold text-white rounded-4xl"
            >
              {" "}
              ← Retour aux chapitres
            </div>
          </section>
        </main>
      ) : (
        <main className="px-4 py-8 min-h-screen flex items-center justify-center">
          <section className="w-full flex justify-center">
            <div className="bg-white rounded-2xl px-8 md:px-15 py-10 space-y-8 w-full md:w-[80%] max-w-2xl shadow-lg md:scale-125">
              <div className="grid justify-center items-center space-y-3 text-center">
                <span className="text-6xl">{appreciationScoreicon(score)}</span>
                <span className="text-4xl md:text-5xl font-bold leading-tight">
                  Chapitre <br /> terminé !
                </span>
                <span className="text-lg text-gray-600">
                  Les nombre de 0 à 10
                </span>
              </div>

              <div className="grid justify-center items-center text-center bg-blue-100 rounded-2xl px-4 py-6">
                <span className="text-6xl md:text-7xl font-bold text-blue-600 mb-2">
                  {score}/{chapscore}
                </span>
                <span className="text-lg text-blue-900 font-medium">
                  {appreciationScore(score)}
                </span>
              </div>

              <div className="grid justify-center gap-4 items-center w-full">
                <button
                  onClick={() => router.push(`/classe/${classe}`)}
                  className="bg-green-500 hover:bg-green-600 rounded-lg text-white px-6 py-3 text-lg font-semibold transition-colors duration-200 w-full md:w-auto"
                >
                  Retour aux chapitres
                </button>

                <button
                  onClick={async () => {
                    setTextValue(""), setinputValue("");
                    setNextQuestion(0);
                    setResultaChapitre(true);
                    setScore(0);
                    await addScore(0);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 rounded-lg text-white px-6 py-3 text-lg font-semibold transition-colors duration-200 w-full md:w-auto"
                >
                  Recommencer l'exercice
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
    </Wrapper>
  );
}
export async function getServerSideProps({ req }) {
  return protectPage(req);
}
export default lecon;
