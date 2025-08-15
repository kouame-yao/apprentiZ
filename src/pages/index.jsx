import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import Wrapper from "../../components/Wrapper";
import { ApplicationContext } from "../../context/ApplicationContextProvider";

function Index() {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const { uid } = useContext(ApplicationContext);

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
    staleTime: 1000 * 60 * 5, // 5 minutes avant de considérer les données "vieilles"
    cacheTime: 1000 * 60 * 60,
  });

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
  // if (error) return "Erreur : " + error.message;

  const Classe = data?.table;

  return (
    <Wrapper
      name={uid ? "Mon profil" : "Se connecter"}
      button={uid ? "/profil" : "/login"}
      color={"bg-green-500"}
      textColor={"text-white"}
    >
      <main className="  grid justify-center items-center px-4 w-full">
        <section className="grid justify-center w-full mb-4">
          <div className="space-y-8 grid justify-center items-center text-center">
            <h1 className="font-bold text-5xl md:text-8xl">
              Apprendre en s'amusant ! 🎓
            </h1>
            <p className="text-lg md:text-3xl text-gray-500 inline-block text-center break-words">
              Découvre les mathématiques et le français avec des exercices
              amusants adaptés à ton niveau !
            </p>
          </div>
        </section>
        <section className="rounded-4xl w-full md:h-auto md:max-w-none md:scale-80">
          <img
            src="/Capture.PNG"
            alt=""
            className="rounded-2xl "
            width={"100%"}
          />
        </section>

        {Classe?.length === 0 ? (
          <section className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Aucune classe trouvée</h2>
            <p className="text-gray-600 mb-6">
              Il semble que vous n'avez pas encore créé de classe. Pour
              commencer à utiliser l'application, veuillez créer une classe.
            </p>
            <button
              onClick={() => router.push("/ajouter-exercice")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Créer une classe
            </button>
          </section>
        ) : (
          <section className="grid space-y-8 mt-8 md:space-y-17">
            {uid && (
              <h1 className="text-3xl md:text-5xl font-bold text-center">
                Choisis ta classe 🎒
              </h1>
            )}
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
              {Classe?.map((item, index) => (
                <div
                  onClick={() => router.push(`classe/${item.nom}`)}
                  key={index}
                  className={`card ${item.Color} rounded-2xl md:px-50 md:h-100 w-full box-border shadow-xl hover:shadow-2xl cursor-pointer ${item.bgCard} transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105  md:p-8`}
                >
                  <div className="card-body text-white h-full flex items-center justify-between">
                    <div className="grid items-center text-center space-y-6">
                      <span className="text-6xl md:text-8xl">📚</span>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                          {item.id}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium">
                          {item.Descrip}
                        </p>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => router.push(`classe/${item.nom}`)}
                        className="bg-white/20 backdrop-blur-sm border-2  border-white/30 hover:bg-white/30 hover:border-white/50 shadow-xl rounded-full cursor-pointer text-lg md:text-2xl font-bold md:py-4 px-6 py-2 transition-all duration-300 md:hover:scale-105"
                      >
                        Commencer →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="w-full flex justify-center items-center text-center mt-10 md:mt-17">
          <div className="grid md:flex items-center justify-center gap-4 md:mx-20 w-full">
            {extension.map((item, index) => (
              <div
                key={index}
                className="card-body bg-white box-border rounded-2xl grid justify-center shadow-lg items-center  space-y-4 p-8"
              >
                <span className="text-3xl md:text-8xl">{item.icon}</span>
                <h1 className="font-bold text-2xl md:text-5xl">
                  {item.textH1}
                </h1>
                <p className="text-gray-500 md:text-2xl">{item.textSpan}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <section>
        <div className="bg-white text-center p-8 mt-40">
          © 2025 ApprentiZ - Apprendre en s'amusant
        </div>
      </section>
    </Wrapper>
  );
}

export default Index;
