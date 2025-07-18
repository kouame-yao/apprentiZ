import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wrapper from "../../../../components/Wrapper";

function Lecon() {
  const router = useRouter();
  const { chapitre, lecon, classe } = router.query;
  // console.log("chapitre:", chapitre, "lecon:", lecon, "classe:", classe);

  const [inputValue, setinputValue] = useState("");
  const [TextValue, setTextValue] = useState("");
  const [values, setValues] = useState(null);
  const [score, setScore] = useState(0);
  const [Exerces, setExercices] = useState(0);
  const [total, settotal] = useState(true);
  const [textuelle, settextuelle] = useState("");

  const booleen = ["vrai", "faux"];

  const chapt = (lecon) => {
    if (lecon === "1") return exercice[chapitre];
    if (lecon === "2") return exercice2[chapitre];
  };

  const exercice2 = {
    Mathématique: [
      {
        id: 1,
        title: "Addition simple",
        question: "Combien font 2 + 3 ?",
        result: 5,
        infoErro: "La bonne réponse était : 5.",
        infosucces: "2 + 3 = 5. Bravo !",
        type: "choix",
        option: [4, 5, 6, 3, 7],
      },
      {
        id: 2,
        title: "Addition simple",
        question: "Combien font 1 + 4 ?",
        result: 5,
        infoErro: "La bonne réponse était : 5.",
        infosucces: "1 + 4 = 5. Tu progresses bien !",
        type: "choix",
        option: [2, 5, 6, 1, 3],
      },
      {
        id: 3,
        title: "Addition simple",
        question: "3 + 3 = 6",
        result: "vrai",
        infoErro: "La bonne réponse était : vrai.",
        infosucces: "Oui, 3 + 3 = 6. Bien joué !",
        type: "booleen",
      },
      {
        id: 4,
        title: "Addition simple",
        question: "Écris le résultat de 4 + 2",
        result: "6",
        infoErro: "La bonne réponse était : 6.",
        infosucces: "4 + 2 = 6. Excellent !",
        type: "input",
      },
      {
        id: 5,
        title: "Addition simple",
        question: "Combien font 5 + 0 ?",
        result: 5,
        infoErro: "La bonne réponse était : 5.",
        infosucces: "5 + 0 = 5. Tu es super fort !",
        type: "choix",
        option: [0, 10, 5, 6, 4],
      },
    ],
  };

  const exercice = {
    Mathématique: [
      {
        id: 1,
        title: "Les nombres de 0 à 10",
        question: "Combien font 3 + 2 ?",
        result: 5,
        infoErro: "La bonne réponse était : 5.",
        infosucces: "3 + 2 = 5. Tu peux compter sur tes doigts !",
        type: "choix",
        option: [4, 8, 6, 7, 5],
      },
      {
        id: 2,
        title: "Les nombres de 0 à 10",
        question: "Quel nombre vient après 7 ?",
        result: 8,
        infoErro: "La bonne réponse était : 8.",
        infosucces: "Après 7 vient 8 dans l'ordre des nombres.",
        type: "choix",
        option: [10, 8, 6, 9, 5],
      },
      {
        id: 3,
        title: "Les nombres de 0 à 10",
        question: "5 est plus grand que 3",
        result: "vrai",
        infoErro: "La bonne réponse était : vrai.",
        infosucces: "C'est vrai ! 5 est plus grand que 3.",
        type: "booleen",
      },
      {
        id: 4,
        title: "Les nombres de 0 à 10",
        question: "Écris le nombre qui vient avant 6",
        result: "5",
        infoErro: "La bonne réponse était : 5.",
        infosucces: "Le nombre qui vient avant 6 est 5.",
        type: "input",
      },
      {
        id: 5,
        title: "Les nombres de 0 à 10",
        question: "Combien font 4 + 1?",
        result: 5,
        infoErro: "La bonne réponse était : 5.",
        infosucces: "4 + 1 = 5. Bravo !",
        type: "choix",
        option: [4, 8, 6, 7, 5],
      },
    ],

    Français: [
      {
        id: 1,
        title: "Les lettres de l’alphabet",
        question: "Quelle lettre vient après B ?",
        result: "C",
        infoErro: "La bonne réponse était : C.",
        infosucces: "Bravo ! Après B vient C dans l’alphabet.",
        type: "choix",
        option: ["D", "A", "E", "C", "F"],
      },
      {
        id: 2,
        title: "Les lettres de l’alphabet",
        question: "La lettre A est-elle une voyelle ?",
        result: "vrai",
        infoErro: "La bonne réponse était : vrai.",
        infosucces: "Oui ! A est une voyelle.",
        type: "booleen",
      },
      {
        id: 3,
        title: "Les lettres de l’alphabet",
        question: "Écris la première lettre de l’alphabet",
        result: "A",
        infoErro: "La bonne réponse était : A.",
        infosucces: "A est la première lettre de l’alphabet.",
        type: "input",
      },
      {
        id: 4,
        title: "Les lettres de l’alphabet",
        question: "Quelle lettre vient avant D ?",
        result: "C",
        infoErro: "La bonne réponse était : C.",
        infosucces: "Bien joué ! Avant D, il y a C.",
        type: "choix",
        option: ["B", "C", "E", "F", "G"],
      },
      {
        id: 5,
        title: "Les lettres de l’alphabet",
        question: "Z est la dernière lettre de l’alphabet",
        result: "vrai",
        infoErro: "La bonne réponse était : vrai.",
        infosucces: "Oui ! L’alphabet se termine par Z.",
        type: "booleen",
      },
    ],
  };

  const chapExo = chapt(lecon);

  const exo = chapExo || {};
  const lengh = exo.length;

  const exoer = total ? exo[Exerces] : null;
  const net = Exerces + 1;
  const pourcentage = (net / lengh) * 100;

  const valide = () => {
    if (exoer?.result === inputValue || exoer?.result === TextValue) {
      setScore((prev) => prev + 4);
      setValues(true);
    } else {
      setValues(false);
    }
  };

  useEffect(() => {
    if (Exerces === lengh - 1) {
      settextuelle("Voir mes résultats");
      settotal(true);
    } else if (Exerces >= lengh) {
      settotal(false);
    } else {
      settextuelle("Question suivante");
      settotal(true);
    }
  }, [Exerces, lengh]);

  const getScoreEmoji = (score) => {
    if (score < 5) return "👎";
    if (score < 10) return "🙂";
    if (score < 15) return "😄";
    if (score >= 20) return "🏆";
    return "😄";
  };

  const getScoreMessage = (score) => {
    if (score < 5) return "Continue tes efforts !";
    if (score < 10) return "Pas mal, tu peux mieux faire !";
    if (score < 15) return "Très bien, continue comme ça !";
    if (score >= 20) return "Parfait ! Tu es un champion !";
    return "Bien joué !";
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!chapitre || !lecon || score === null || score === undefined) return;

    const raw = localStorage.getItem(`score${classe}`);
    const parsed = raw ? JSON.parse(raw) : {};

    const pourcent = localStorage.getItem(`pourcentage${classe}`);
    const tage = pourcent ? JSON.parse(pourcent) : {};

    // ✅ Initialisation séparée si nécessaire
    if (!parsed[chapitre]) parsed[chapitre] = {};
    if (!tage[chapitre]) tage[chapitre] = {};

    // ✅ Stockage des données
    parsed[chapitre][lecon] = score;
    tage[chapitre][lecon] = pourcentage;

    // ✅ Mise à jour dans localStorage
    localStorage.setItem(`score${classe}`, JSON.stringify(parsed));
    localStorage.setItem(`pourcentage${classe}`, JSON.stringify(tage));
  }, [router.isReady, score, chapitre, lecon, pourcentage]);
  return (
    <Wrapper nav={"Mon profil"}>
      {total ? (
        <main className="px-4 space-y-8 grid justify-center items-center">
          <section>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>
                  Question {Exerces + 1} sur {lengh}
                </p>
                <p>{pourcentage}%</p>
              </div>
              <div className="bg-white h-full rounded-4xl w-full md:w-lvh">
                <div
                  style={{ width: `${pourcentage}%` }}
                  className="bg-blue-500 h-full p-2 rounded-4xl transition-all duration-300"
                ></div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white shadow-2xl  transition delay-300 duration-800 ease-in-out hover:-translate-y-1 hover:scale-105 text-center rounded-3xl px-7 grid gap-8 py-8 justify-center items-center md:w-lvh w-full">
              <div className="grid gap-4 text-2xl font-bold">
                <h1>{exoer?.title}</h1>❓<h1>{exoer?.question}</h1>
              </div>
              <div>
                {values === null ? (
                  <div>
                    {exoer?.type === "choix" && (
                      <div className="grid gap-4 md:w-lg">
                        {exoer.option.map((item) => {
                          const active =
                            item === TextValue
                              ? "bg-blue-300 border-blue-500 text-blue-800"
                              : "border-gray-300 text-black";
                          return (
                            <div
                              key={item}
                              onClick={() => setTextValue(item)}
                              className={`text-lg font-bold border-2 ${active} p-4 rounded-lg`}
                            >
                              {item}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {exoer?.type === "booleen" && (
                      <div className="flex gap-4 w-full">
                        {booleen.map((item, index) => {
                          const iconic = item === "vrai" ? "✔️" : "❌​";
                          const active =
                            item === TextValue
                              ? "bg-blue-300 border-blue-500 text-blue-500"
                              : "border-gray-300 text-black";
                          return (
                            <div
                              key={index}
                              onClick={() => setTextValue(item)}
                              className={`text-lg font-bold border-2 ${active} p-4 w-full rounded-lg`}
                            >
                              {item} {iconic}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {exoer?.type === "input" && (
                      <input
                        value={inputValue}
                        onChange={(e) => setinputValue(e.target.value)}
                        type="text"
                        placeholder="Ecris ta réponse ici..."
                        className="border-gray-300 border-2 w-full text-blue-800 text-lg font-bold focus:border-blue-500 placeholder:text-gray-300 p-2 rounded-lg outline-none text-center"
                      />
                    )}

                    <div>
                      <button
                        onClick={valide}
                        className="bg-gray-300 cursor-pointer  mt-4 text-lg font-bold text-white px-5 py-3 w-50 rounded-4xl"
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values ? (
                      <div className="text-center grid gap-3">
                        <h1 className="text-6xl">🎉</h1>
                        <div className="bg-green-200 py-5 px-3 rounded-lg">
                          <h1 className="text-green-800 font-bold">
                            Correct !
                          </h1>
                          <p className="text-green-600">{exoer?.infosucces}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center grid gap-3">
                        <h1 className="text-6xl">😔</h1>
                        <div className="bg-red-200 py-5 px-3 rounded-lg">
                          <h1 className="text-red-800 font-bold">
                            Pas tout à fait...
                          </h1>
                          <p className="text-red-600">{exoer?.infosucces}</p>
                          <p className="text-red-600">{exoer?.infoErro}</p>
                        </div>
                      </div>
                    )}
                    <div
                      onClick={() => {
                        if (Exerces < lengh) {
                          setExercices((prev) => prev + 1);
                          setValues(null);
                          setTextValue("");
                          setinputValue("");
                        }
                      }}
                      className="btn btn-primary text-lg bg-green-400 border-none font-bold text-white rounded-4xl"
                    >
                      {textuelle}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="px-10 grid justify-center items-center mb-20">
            <div
              onClick={() => router.push(`/classe/${classe}`)}
              className="text-white  px-4 text-lg font-bold bg-gray-600 p-2 rounded-3xl text-center w-60"
            >
              ⬅️ Retour aux chapitres
            </div>
          </section>
        </main>
      ) : (
        <main className="px-4 text-center grid justify-center">
          <div className="bg-white px-4 pt-10 pb-10 shadow-lg w-full md:w-lg space-y-4 rounded-2xl py-4 text-center grid justify-center items-center">
            <h1 className="text-6xl">{getScoreEmoji(score)}</h1>
            <h1 className="text-2xl font-bold">Chapitre terminé !</h1>
            <span>{exoer?.title ?? "Résumé"}</span>
            <div className="bg-blue-300 w-full p-6 rounded-lg">
              <span className="text-5xl font-bold text-blue-800">
                {score}/20
              </span>
              <p className="text-violet-700">{getScoreMessage(score)}</p>
            </div>
            <div className="grid gap-4 text-white font-bold text-lg">
              <button
                onClick={() => router.push(`/classe/${classe}`)}
                className="btn btn-success bg-green-500 border-none"
              >
                Retour aux chapitres
              </button>
              <button
                onClick={() => {
                  setExercices(0);
                  setScore(0);
                  setValues(null);
                  settotal(true);
                }}
                className="btn btn-primary bg-blue-500 border-none"
              >
                Recommencer l'exercice
              </button>
            </div>
          </div>
        </main>
      )}
    </Wrapper>
  );
}

export default Lecon;
