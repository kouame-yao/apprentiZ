import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wrapper from "../../../components/Wrapper";
// CP1
import CP1exercice5 from "../../../components/CP1/maths/chapitrefive";
import CP1exercice4 from "../../../components/CP1/maths/chapitrefor";
import CP1exercice1 from "../../../components/CP1/maths/chapitreone";
import CP1exercice3 from "../../../components/CP1/maths/chapitretree";
import CP1exercice2 from "../../../components/CP1/maths/chapitretwo";
// CP2
import chapitre5_CP2 from "../../../components/CP2/maths_fran/chapitrefive";
import chapitre4_CP2 from "../../../components/CP2/maths_fran/chapitrefor";
import chapitre1_CP2 from "../../../components/CP2/maths_fran/chapitreone";
import chapitre2_CP2 from "../../../components/CP2/maths_fran/chapitrestwo";
import chapitre3_CP2 from "../../../components/CP2/maths_fran/chapitretree";

//CE1
import chapitre1_CE1 from "../../../components/CE1/maths_fran/chapitre1";
import chapitre2_CE1 from "../../../components/CE1/maths_fran/chapitre2";
import chapitre3_CE1 from "../../../components/CE1/maths_fran/chapitre3";
import chapitre4_CE1 from "../../../components/CE1/maths_fran/chapitre4";
import chapitre5_CE1 from "../../../components/CE1/maths_fran/chapitre5";

// CE2
import chapitre1_CE2 from "../../../components/CE2/maths_fran/chapitre1";
import chapitre2_CE2 from "../../../components/CE2/maths_fran/chapitre2";
import chapitre3_CE2 from "../../../components/CE2/maths_fran/chapitre3";
import chapitre4_CE2 from "../../../components/CE2/maths_fran/chapitre4";
import chapitre5_CE2 from "../../../components/CE2/maths_fran/chapitre5";

// CM1
import chapitre1_CM1 from "../../../components/CM1/maths_fran/chapitre1";
import chapitre2_CM1 from "../../../components/CM1/maths_fran/chapitre2";
import chapitre3_CM1 from "../../../components/CM1/maths_fran/chapitre3";
import chapitre4_CM1 from "../../../components/CM1/maths_fran/chapitre4";
import chapitre5_CM1 from "../../../components/CM1/maths_fran/chapitre5";

// CM2
import chapitre1_CM2 from "../../../components/CM2/maths_fran/chapitre1";
import chapitre2_CM2 from "../../../components/CM2/maths_fran/chapitre2";
import chapitre3_CM2 from "../../../components/CM2/maths_fran/chapitre3";
import chapitre4_CM2 from "../../../components/CM2/maths_fran/chapitre4";
import chapitre5_CM2 from "../../../components/CM2/maths_fran/chapitre5";

export default function Classe() {
  const [MatierePage, setMatierePage] = useState("Mathématique");
  const [Score, setscore] = useState({});
  const [Pourcentage, setPourcentage] = useState({});
  const [activeEtape, setActiveEtape] = useState(true);
  const router = useRouter();

  const classeId = router.query;

  const toggle = (mat) => {
    setMatierePage(mat);
  };
  const matiere = [
    { id: 1, matiere: "Mathématique", icon: "📊" },
    { id: 2, matiere: "Français", icon: "📚" },
  ];
  const chapitre = {
    Mathématique: [
      {
        id: 1,
        chapitre: "chapitre 1",
        div: "chapitre1",
      },
      {
        id: 2,
        chapitre: "chapitre 2",
        div: "chapitre2",
      },
      {
        id: 3,
        chapitre: "chapitre 3",
        div: "chapitre3",
      },
      {
        id: 4,
        chapitre: "chapitre 4",
        div: "chapitre4",
      },
      {
        id: 5,
        chapitre: "chapitre 5",
        div: "chapitre5",
      },
    ],
    Français: [
      {
        id: 1,
        chapitre: "chapitre 1",
      },
      {
        id: 2,
        chapitre: "chapitre 2",
      },
      {
        id: 3,
        chapitre: "chapitre 3",
      },
      {
        id: 4,
        chapitre: "chapitre 4",
      },
      {
        id: 5,
        chapitre: "chapitre 5",
      },
    ],
  };

  const getChapitreLengths = () => {
    if (classeId.id === "CP1") {
      return {
        chapitre1: CP1exercice1[MatierePage]?.length || 0,
        chapitre2: CP1exercice2[MatierePage]?.length || 0,
        chapitre3: CP1exercice3[MatierePage]?.length || 0,
        chapitre4: CP1exercice4[MatierePage]?.length || 0,
        chapitre5: CP1exercice5[MatierePage]?.length || 0,
      };
    } else if (classeId.id === "CP2") {
      return {
        chapitre1: chapitre1_CP2[MatierePage]?.length || 0,
        chapitre2: chapitre2_CP2[MatierePage]?.length || 0,
        chapitre3: chapitre3_CP2[MatierePage]?.length || 0,
        chapitre4: chapitre4_CP2[MatierePage]?.length || 0,
        chapitre5: chapitre5_CP2[MatierePage]?.length || 0,
      };
    } else if (classeId.id === "CE1") {
      return {
        chapitre1: chapitre1_CE1[MatierePage]?.length || 0,
        chapitre2: chapitre2_CE1[MatierePage]?.length || 0,
        chapitre3: chapitre3_CE1[MatierePage]?.length || 0,
        chapitre4: chapitre4_CE1[MatierePage]?.length || 0,
        chapitre5: chapitre5_CE1[MatierePage]?.length || 0,
      };
    } else if (classeId.id === "CE2") {
      return {
        chapitre1: chapitre1_CE2[MatierePage]?.length || 0,
        chapitre2: chapitre2_CE2[MatierePage]?.length || 0,
        chapitre3: chapitre3_CE2[MatierePage]?.length || 0,
        chapitre4: chapitre4_CE2[MatierePage]?.length || 0,
        chapitre5: chapitre5_CE2[MatierePage]?.length || 0,
      };
    } else if (classeId.id === "CM1") {
      return {
        chapitre1: chapitre1_CM1[MatierePage]?.length || 0,
        chapitre2: chapitre2_CM1[MatierePage]?.length || 0,
        chapitre3: chapitre3_CM1[MatierePage]?.length || 0,
        chapitre4: chapitre4_CM1[MatierePage]?.length || 0,
        chapitre5: chapitre5_CM1[MatierePage]?.length || 0,
      };
    } else if (classeId.id === "CM2") {
      return {
        chapitre1: chapitre1_CM2[MatierePage]?.length || 0,
        chapitre2: chapitre2_CM2[MatierePage]?.length || 0,
        chapitre3: chapitre3_CM2[MatierePage]?.length || 0,
        chapitre4: chapitre4_CM2[MatierePage]?.length || 0,
        chapitre5: chapitre5_CM2[MatierePage]?.length || 0,
      };
    }
    // Ajouter d'autres classes ici si nécessaire
    return {};
  };

  const chapitreLengths = getChapitreLengths();

  // Si tu veux la somme de tous les exercices :
  const totalExos = Object.values(chapitreLengths).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const raw = localStorage.getItem(`score${classeId.id}`);
    const parsed = raw ? JSON.parse(raw) : {};
    setscore(parsed);

    const pourcent = localStorage.getItem(`pourcentage${classeId.id}`);
    const tage = pourcent ? JSON.parse(pourcent) : {};

    setPourcentage(tage);
  }, [classeId.id, MatierePage]);
  // console.log(Score);
  // console.log(chapitre);

  function calculerTotalPourcentage(pourcentage) {
    let total = 0;

    Object.values(pourcentage).forEach((chapitres) => {
      Object.values(chapitres).forEach((val) => {
        const num = parseInt(val);
        if (!isNaN(num)) {
          total += num;
        }
      });
    });

    return total;
  }

  const Pource = calculerTotalPourcentage(Pourcentage);
  const totalChapitres = Object.values(chapitre).reduce(
    (total, chapList) => total + chapList.length,
    0
  );
  const moyenne = Pource && totalChapitres ? Pource / totalChapitres : 0;
  const totalPour = moyenne.toFixed(0);

  const totalPoucen = (tot) => {
    if (Number(tot) > 100) {
      return Number(tot) - 20;
    }
    return Number(tot);
  };

  console.log();

  const isChapterUnlocked = (matiere, chapitreId) => {
    // Chapitre 1 est toujours accessible
    if (chapitreId === 1) return true;
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(`score${classeId.id}`);
    if (!raw) return false;

    const data = JSON.parse(raw);

    // ID du chapitre précédent
    const chapitrePrecedent = (chapitreId - 1).toString();

    // Vérifie si un score existe pour ce chapitre précédent
    return (
      data[matiere] &&
      data[matiere][chapitrePrecedent] &&
      data[matiere][chapitrePrecedent] > 5
    );
  };

  return (
    <Wrapper nav={"Mon profil"}>
      <main className="px-4 md:px-25 space-y-4">
        <section>
          <div className="card-body bg-red-400 rounded-3xl p-8 text-white">
            <h1 className="text-4xl font-bold">{classeId.id}</h1>
            <div className="flex justify-center items-center ">
              <p className="text-lg text-gray-200">
                Cours Préparatoire Première année
              </p>{" "}
              <span className="text-7xl">🎓</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Progression générale</span>
              <span>{totalPoucen(totalPour)} %</span>
            </div>
            <div className="p-2 rounded-3xl w-full bg-white">
              <div
                className="p-2 rounded-3xl bg-blue-400"
                style={{ width: `${totalPoucen(totalPour)}%` }}
              ></div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="bg-white py-2 rounded-4xl w-full flex px-2  justify-center gap-2">
            {matiere.map((item) => {
              const active = MatierePage === item.matiere;
              let bgGlob = "bg-white";
              if (active && item.matiere === "Mathématique")
                bgGlob = "bg-blue-400";
              else if (active && item.matiere === "Français")
                bgGlob = "bg-red-500";
              return (
                <button
                  onClick={() => toggle(item.matiere)}
                  key={item.id}
                  className={`font-bold ${bgGlob} w-full py-4 rounded-4xl`}
                >
                  {item.icon} {item.matiere}
                </button>
              );
            })}
          </div>
        </section>
        <section className="w-full">
          <div className="grid md:grid-cols-3 gap-4">
            {chapitre?.[MatierePage]?.map((item) => {
              const id = String(item.id);

              const NewScore = Score[MatierePage]?.[id] ?? 0;

              const getScoreEmoji = (score) => {
                if (score < 5) return "👎";
                if (score < 10) return "🙂";
                if (score < 15) return "😄";
                if (score >= 20) return "🏆";
                return "😄";
              };
              const active = isChapterUnlocked(MatierePage, item.id);

              let unklow;
              let iconik;
              let text = "Commencer";
              let bgbtn;
              let textbtn;
              let bgbtnRe;
              if (NewScore > 0) {
                text = "Recommencer ";
                bgbtnRe = "bg-violet-800";
              }
              let textverouil = "";

              if (active) {
                textbtn = "text-white";
                bgbtn = "bg-green-400";
                unklow = "bg-white cursor-pointer  ";
                iconik = "📖";
                // text = "Recommencer";
              } else if (!active) {
                textbtn = "text-black";
                bgbtn = "bg-gray-400";
                text = "Vérrouillé";
                iconik = "🔒";
                unklow =
                  "bg-white pointer-events-none cursor-not-allowed opacity-50 ";

                textverouil =
                  "Tu dois avoir plus de 5 points pour débloquer le chapitre suivant.";
              }

              const divodent = chapitreLengths[`chapitre${item.id}`];
              return (
                <div
                  onClick={() =>
                    router.push(
                      `/exercice/${MatierePage}/${item.id}?classe=${classeId.id}`
                    )
                  }
                  key={item.id}
                  className={` ${unklow} rounded-3xl px-4 py-8 grid gap-3 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105`}
                >
                  <div className="flex text-3xl justify-between items-center ">
                    <span>{iconik}</span>
                    <span>{getScoreEmoji(NewScore)}</span>
                  </div>
                  <h1 className="text-lg font-bold">{item.chapitre}</h1>
                  <p className="text-red-900 text-sm font-bold">
                    {textverouil}
                  </p>
                  <div className=" text-green-400 border-none bg-green-200 badge badge-success font-bold ">
                    {NewScore}/{divodent * 4}
                  </div>
                  <button
                    className={`btn cursor-pointer ${bgbtn} ${textbtn} ${bgbtnRe}  rounded-md  border-none btn-success font-bold`}
                  >
                    {text}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        <section className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className=" p-4  cursor-pointer rounded-4xl text-white font-bold text-lg px-4 bg-violet-600"
          >
            ⬅️ Retour aux classes
          </button>
        </section>
      </main>
    </Wrapper>
  );
}
