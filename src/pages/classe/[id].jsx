import { useRouter } from "next/router";
import { useState } from "react";
import Wrapper from "../../../components/Wrapper";

export default function Classe() {
  const [MatierePage, setMatierePage] = useState("Mathématique");

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
        exo: "Les nombres de 0 à 10",
        score: 18 / 20,
        active: true,
      },
      {
        id: 2,
        chapitre: "chapitre 2",
        exo: "Addition simple",
        score: 18 / 20,
        active: true,
      },
      {
        id: 3,
        chapitre: "chapitre 3",
        exo: "Soustraction simple",
        score: 18 / 20,
        active: true,
      },
      {
        id: 4,
        chapitre: "chapitre 4",
        exo: "Les formats géométriques",
        score: 18 / 20,
        active: false,
      },
      {
        id: 5,
        chapitre: "chapitre 5",
        exo: "Compter jusqu'à 20",
        score: 18 / 20,
        active: false,
      },
    ],
    Français: [
      {
        id: 1,
        chapitre: "chapitre 1",
        exo: "L'alphabet",
        score: "20/20",
        active: true,
      },
      {
        id: 2,
        chapitre: "chapitre 2",
        exo: "L'alphabet",
        score: "20/20",
        active: true,
      },
      {
        id: 3,
        chapitre: "chapitre 3",
        exo: "L'alphabet",
        score: "20/20",
        active: true,
      },
      {
        id: 4,
        chapitre: "chapitre 4",
        exo: "Premiers Mots",
        score: "20/20",
        active: false,
      },
      {
        id: 5,
        chapitre: "chapitre 5",
        ex: "Phrase simples",
        score: "20/20",
        active: false,
      },
    ],
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
              <span>40%</span>
            </div>
            <div className="p-2 rounded-3xl w-full bg-white"></div>
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
              let unklow;
              let iconik;
              let text;
              let bgbtn;
              let textbtn;
              if (item.active === true) {
                textbtn = "text-white";
                bgbtn = "bg-green-400";
                unklow = "bg-white cursor-pointer  ";
                iconik = "📖";
                text = "Recommencer";
              } else if (item.active === false) {
                textbtn = "text-black";
                bgbtn = "bg-gray-400";
                text = "Vérrouillé";
                iconik = "🔒";
                unklow =
                  "bg-white pointer-events-none cursor-not-allowed opacity-50 ";
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
                    <span>🙂</span>
                  </div>
                  <h1 className="text-lg font-bold">{item.chapitre}</h1>
                  <p className="text-gray-400 text-lg">{item.exo}</p>
                  <div className=" text-green-400 border-none bg-green-200 badge badge-success font-bold ">
                    {item.score}
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
