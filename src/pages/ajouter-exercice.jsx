import { useRouter } from "next/router";
import { useState } from "react";
import Wrapper from "../../components/Wrapper";
import Classe_existant from "../../components/naviagtionProfil/Créer/sections/classe-existant";
import Classe_eleve from "../../components/naviagtionProfil/Créer/sections/classe_eleve";
import { protectPage } from "../../lib/auth";

const ajout = [
  {
    icon: "📚",
    title: "Classe existante",
    desciption: "Ajouter à une classe et un chapitre déjà créés",
  },
  {
    icon: "🆕",
    title: "Nouvelle classe",
    desciption: "Créer une nouvelle classe et un nouveau chapitre",
  },
];

function ajouter_exercice() {
  const [Select, setSelect] = useState("");
  const [section0, setSection0] = useState(true);
  const [section1, setSection1] = useState(false);
  const [section2, setSection2] = useState(false);

  const valide = () => {
    if (Select === "Classe existante") {
      setSection1(true);
      setSection0(false);
      setSection2(false);
    } else if (Select === "Nouvelle classe") {
      setSection2(true);
      setSection0(false);
      setSection1(false);
    }
  };
  const router = useRouter();

  return (
    <Wrapper name={"← Profil"} button={"/profil"} textColor={"text-white"}>
      <main className="grid place-items-center md:gap-8 gap-4 px-4 ">
        <section>
          <div className="bg-white rounded-lg p-2 w-full  shadow-lg px-3 md:w-400 md:rounded-3xl md:grid md:justify-center md:items-center md:place-items-center md:py-15">
            <span className="md:text-5xl">➕ Ajouter un exercice</span>
            <span className="md:text-3xl md:text-center">
              Créez de nouveaux exercices pour enrichir vos cours
            </span>
          </div>
        </section>
        {section0 && (
          <section className="bg-white rounded-lg px-3 py-4 w-full shadow-lg grid gap-4 md:px-10 md:py-10 md:rounded-3xl md:w-400">
            <div className="md:text-4xl md:font-semibold">
              🎯 Comment souhaitez-vous ajouter l'exercice ?
            </div>
            <div className="grid gap-4 md:flex">
              {ajout.map((item, index) => {
                const Active =
                  item.title === Select
                    ? "border-violet-500 bg-violet-100"
                    : "border-gray-200";
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelect(item.title);
                    }}
                    className={`${Active} md:flex-1 md:border-3 md:rounded-3xl md:border-gray-400 md:py-20 md:px-15 hover:shadow-lg cursor-pointer border rounded-lg p-2 grid gap-2 text-center `}
                  >
                    <span className="text-2xl md:text-6xl">{item.icon}</span>
                    <span className="font-bold text-lg md:text-4xl">
                      {item.title}
                    </span>
                    <span className="text-sm md:text-2xl">
                      {item.desciption}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex text-center justify-center items-center">
              {Select && (
                <button
                  onClick={() => {
                    valide();
                  }}
                  className={`cursor-pointer md:w-60 md:py-6 md:text-3xl md:font-semibold md:rounded-full rounded-4xl px-3 text-center py-2 bg-violet-500  text-white`}
                >
                  Continuer →
                </button>
              )}
            </div>
          </section>
        )}
        {section1 && (
          <Classe_existant
            button={() => {
              setSection1(!true);
              setSection0(!false);
              setSection2(false);
              setSelect("");
            }}
          />
        )}
        {section2 && (
          <section>
            <Classe_eleve
              button={() => {
                setSection2(!true);
                setSection0(!false);
                setSection1(false);
                setSelect("");
              }}
            />
          </section>
        )}
      </main>
    </Wrapper>
  );
}
export async function getServerSideProps({ req }) {
  return protectPage(req);
}
export default ajouter_exercice;
