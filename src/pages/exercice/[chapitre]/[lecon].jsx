import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wrapper from "../../../../components/Wrapper";
// CP1
import CP1exercice5 from "../../../../components/CP1/maths/chapitrefive";
import CP1exercice4 from "../../../../components/CP1/maths/chapitrefor";
import CP1exercice1 from "../../../../components/CP1/maths/chapitreone";
import CP1exercice3 from "../../../../components/CP1/maths/chapitretree";
import CP1exercice2 from "../../../../components/CP1/maths/chapitretwo";
// CP2
import chapitre5_CP2 from "../../../../components/CP2/maths_fran/chapitrefive";
import chapitre4_CP2 from "../../../../components/CP2/maths_fran/chapitrefor";
import chapitre1_CP2 from "../../../../components/CP2/maths_fran/chapitreone";
import chapitre2_CP2 from "../../../../components/CP2/maths_fran/chapitrestwo";
import chapitre3_CP2 from "../../../../components/CP2/maths_fran/chapitretree";

//CE1
import chapitre1_CE1 from "../../../../components/CE1/maths_fran/chapitre1";
import chapitre2_CE1 from "../../../../components/CE1/maths_fran/chapitre2";
import chapitre3_CE1 from "../../../../components/CE1/maths_fran/chapitre3";
import chapitre4_CE1 from "../../../../components/CE1/maths_fran/chapitre4";
import chapitre5_CE1 from "../../../../components/CE1/maths_fran/chapitre5";

// CE2
import chapitre1_CE2 from "../../../../components/CE2/maths_fran/chapitre1";
import chapitre2_CE2 from "../../../../components/CE2/maths_fran/chapitre2";
import chapitre3_CE2 from "../../../../components/CE2/maths_fran/chapitre3";
import chapitre4_CE2 from "../../../../components/CE2/maths_fran/chapitre4";
import chapitre5_CE2 from "../../../../components/CE2/maths_fran/chapitre5";

// CM1
import chapitre1_CM1 from "../../../../components/CM1/maths_fran/chapitre1";
import chapitre2_CM1 from "../../../../components/CM1/maths_fran/chapitre2";
import chapitre3_CM1 from "../../../../components/CM1/maths_fran/chapitre3";
import chapitre4_CM1 from "../../../../components/CM1/maths_fran/chapitre4";
import chapitre5_CM1 from "../../../../components/CM1/maths_fran/chapitre5";

// CM2
import chapitre1_CM2 from "../../../../components/CM2/maths_fran/chapitre1";
import chapitre2_CM2 from "../../../../components/CM2/maths_fran/chapitre2";
import chapitre3_CM2 from "../../../../components/CM2/maths_fran/chapitre3";
import chapitre4_CM2 from "../../../../components/CM2/maths_fran/chapitre4";
import chapitre5_CM2 from "../../../../components/CM2/maths_fran/chapitre5";

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
    //CP1
    if (lecon === "1" && classe === "CP1") return CP1exercice1[chapitre];
    if (lecon === "2" && classe === "CP1") return CP1exercice2[chapitre];
    if (lecon === "3" && classe === "CP1") return CP1exercice3[chapitre];
    if (lecon === "4" && classe === "CP1") return CP1exercice4[chapitre];
    if (lecon === "5" && classe === "CP1") return CP1exercice5[chapitre];

    //CP2
    if (lecon === "1" && classe === "CP2") return chapitre1_CP2[chapitre];
    if (lecon === "2" && classe === "CP2") return chapitre2_CP2[chapitre];
    if (lecon === "3" && classe === "CP2") return chapitre3_CP2[chapitre];
    if (lecon === "4" && classe === "CP2") return chapitre4_CP2[chapitre];
    if (lecon === "5" && classe === "CP2") return chapitre5_CP2[chapitre];

    // CE1
    if (lecon === "1" && classe === "CE1") return chapitre1_CE1[chapitre];
    if (lecon === "2" && classe === "CE1") return chapitre2_CE1[chapitre];
    if (lecon === "3" && classe === "CE1") return chapitre3_CE1[chapitre];
    if (lecon === "4" && classe === "CE1") return chapitre4_CE1[chapitre];
    if (lecon === "5" && classe === "CE1") return chapitre5_CE1[chapitre];

    // CE2

    if (lecon === "1" && classe === "CE2") return chapitre1_CE2[chapitre];
    if (lecon === "2" && classe === "CE2") return chapitre2_CE2[chapitre];
    if (lecon === "3" && classe === "CE2") return chapitre3_CE2[chapitre];
    if (lecon === "4" && classe === "CE2") return chapitre4_CE2[chapitre];
    if (lecon === "5" && classe === "CE2") return chapitre5_CE2[chapitre];

    // CM1
    if (lecon === "1" && classe === "CM1") return chapitre1_CM1[chapitre];
    if (lecon === "2" && classe === "CM1") return chapitre2_CM1[chapitre];
    if (lecon === "3" && classe === "CM1") return chapitre3_CM1[chapitre];
    if (lecon === "4" && classe === "CM1") return chapitre4_CM1[chapitre];
    if (lecon === "5" && classe === "CM1") return chapitre5_CM1[chapitre];

    // CM2
    if (lecon === "1" && classe === "CM2") return chapitre1_CM2[chapitre];
    if (lecon === "2" && classe === "CM2") return chapitre2_CM2[chapitre];
    if (lecon === "3" && classe === "CM2") return chapitre3_CM2[chapitre];
    if (lecon === "4" && classe === "CM2") return chapitre4_CM2[chapitre];
    if (lecon === "5" && classe === "CM2") return chapitre5_CM2[chapitre];
  };

  const chapExo = chapt(lecon);

  const exo = chapExo || {};
  const lengh = exo.length;

  const exoer = total ? exo[Exerces] : null;
  const net = Exerces + 1;
  const pourcentage = (net / lengh) * 100;

  const valide = () => {
    const userAnswer = inputValue?.trim().toLowerCase();
    const resultNormalized = exoer?.result.map((r) => r.trim().toLowerCase());
    const userText = TextValue.trim().toLowerCase();

    if (
      resultNormalized.includes(userAnswer) ||
      resultNormalized.includes(userText)
    ) {
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
                <p></p>
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
                        disabled={
                          exoer?.type === "choix"
                            ? !TextValue
                            : !inputValue || exoer?.type === "booleen"
                            ? !TextValue
                            : !inputValue || exoer?.type === "input"
                            ? !inputValue
                            : !TextValue
                        }
                        className="bg-blue-500 cursor-pointer disabled:bg-gray-50 mt-4 text-lg font-bold text-white px-5 py-3 w-50 rounded-4xl"
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
                          {/* <p className="text-red-600">{exoer?.infosucces}</p> */}
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

          <section className="px-10 grid justify-center items-center mb-20 ">
            <div
              onClick={() => router.push(`/classe/${classe}`)}
              className="text-white px-4 text-lg font-bold bg-gray-600 p-2 rounded-3xl text-center w-60"
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
              <span className="text-5xl font-bold text-blue-800">{score}</span>
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
