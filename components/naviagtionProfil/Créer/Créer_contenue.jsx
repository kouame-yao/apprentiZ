export default function Créer_contenue() {
  const exemple = [
    {
      icon: "🏫",
      title: "Créer une classe",
      desciption: "Définir un nouveau niveau scolaire",
    },
    {
      icon: "📖",
      title: "Ajouter un chapitre",
      desciption: "Créer un nouveau thème d'apprentissage",
    },
    {
      icon: "❓",
      title: "Créer des exercices",
      desciption: "Ajouter des questions et activités",
    },
  ];
  return (
    <div>
      <main className="bg-white rounded-lg px-3 py-4 grid gap-4 shadow-lg w-full md:rounded-3xl md:py-8 md:px-10">
        <section className="grid md:flex md:justify-between gap-4">
          <span className="font-bold md:w-full md:text-3xl">
            Créer du contenu éducatif
          </span>
          <a
            href="/ajouter-exercice"
            className="text-white md:text-2xl bg-green-500 py-2 text-center w-full md:py-4 md:w-90 rounded-4xl"
          >
            ➕ Nouveau contenu
          </a>
        </section>
        <section className="grid gap-4 md:flex w-full">
          {exemple.map((item, index) => {
            return (
              <div
                key={index}
                className="border border-dashed rounded-lg p-2 md:py-20 text-center md:flex-1 grid gap-2"
              >
                <span className="text-3xl md:text-5xl"> {item.icon} </span>
                <span className="font-bold md:text-4xl"> {item.title} </span>
                <span className="md:text-2xl"> {item.desciption} </span>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
