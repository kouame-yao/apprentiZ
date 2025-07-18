import { useRouter } from "next/router";
import Wrapper from "../../components/Wrapper";

function index() {
  const router = useRouter();

  const Classe = [
    { id: 1, classe: "CP1", bgCard: "bg-red-500", bgBtn: "bg-red-400" },
    { id: 2, classe: "CP2", bgCard: "bg-blue-500", bgBtn: "bg-blue-400" },
    { id: 3, classe: "CE1", bgCard: "bg-green-500", bgBtn: "bg-green-400" },
    { id: 4, classe: "CE2", bgCard: "bg-yellow-500", bgBtn: "bg-yellow-400" },
    { id: 5, classe: "CM1", bgCard: "bg-violet-500", bgBtn: "bg-violet-400" },
    { id: 6, classe: "CM2", bgCard: "bg-red-300", bgBtn: "bg-red-200" },
  ];

  const extension = [
    {
      id: 1,
      icon: "🎯",
      textH1: "Exercices adaptés",
      textSpan: "Des exercices personnalisés selon ton niveau",
    },
    {
      id: 2,
      icon: "🏆",
      textH1: "Progression suivie",
      textSpan: "Vois tes progrès chapitre par chapitre",
    },
    {
      id: 3,
      icon: "🎮",
      textH1: "Apprentissage ludique",
      textSpan: "Apprends en jouant avec des exercices amusants",
    },
  ];
  return (
    <Wrapper nav={"Se connecter"}>
      <main className="space-y-15 grid justify-center items-center px-4 w-full">
        <section className="grid justify-center w-full">
          <div className="space-y-4 grid justify-center items-center text-center">
            <h1 className="font-bold text-5xl md:text-6xl">
              Apprendre en s'amusant ! 🎓
            </h1>
            <p className=" text-lg text-gray-500 inline-block text-center break-words">
              Découvre les mathématiques et le français avec des exercices
              amusants adaptés à ton niveau !
            </p>
          </div>
        </section>

        <section className="grid justify-center text-center">
          <img src="/Capture.PNG" alt="" className="rounded-2xl" />
        </section>

        <h1 className="text-3xl font-bold text-center ">
          Choisis ta classe 🎒
        </h1>

        <section className="">
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 ">
            {Classe.map((item) => (
              <div
                onClick={() => router.push(`classe/${item.classe}`)}
                key={item.id}
                className={`card rounded-2xl md:w-100 shadow-md hover:shadow-lg cursor-pointer ${item.bgCard} transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110`}
              >
                <div className="card-body text-white space-y-3 text-center ">
                  <span className="text-6xl">📚</span>
                  <h1 className="text-3xl font-bold">{item.classe}</h1>
                  <p className="text-lg whitespace-nowrap">
                    Cours Préparatoire Première année
                  </p>
                  <div className="px-8">
                    <button
                      onClick={() => router.push(`classe/${item.classe}`)}
                      className={`${item.bgBtn} cursor-pointer text-lg font-bold p-2 px-5  rounded-3xl`}
                    >
                      Commencer ➡️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full flex justify-center items-center text-center  ">
          <div className=" grid md:flex items-center justify-center gap-4 md:mx-20 w-full">
            {extension.map((item) => (
              <div className=" card-body bg-white box-border rounded-2xl grid justify-center shadow-lg items-center text-center space-y-4 p-8">
                <span className="text-3xl">{item.icon}</span>
                <h1 className="font-bold text-2xl">{item.textH1}</h1>
                <p className="text-gray-500">{item.textSpan}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* footer */}
      <section>
        <div className="bg-white text-center p-8 mt-40">
          © 2024 EduKids - Apprendre en s'amusant
        </div>
      </section>
    </Wrapper>
  );
}

export default index;
