import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wrapper from "../../../components/Wrapper";

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
      data[matiere][chapitrePrecedent] > 10
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
              <span>{totalPour} %</span>
            </div>
            <div className="p-2 rounded-3xl w-full bg-white">
              <div
                className="p-2 rounded-3xl bg-blue-400"
                style={{ width: `${totalPour}%` }}
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

              if (NewScore > 0) {
                text = "Recommencer";
              }
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
              }
              let textverouil = "";
              if (item.chapitre == "chapitre 1") {
                textverouil;
              } else if (NewScore < 10) {
                textverouil =
                  "Tu dois avoir plus de 10 points pour débloquer ce chapitre.";
              }
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
                    {NewScore}/20
                  </div>
                  <button
                    className={`btn cursor-pointer ${bgbtn} ${textbtn} rounded-md  border-none btn-success font-bold`}
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
