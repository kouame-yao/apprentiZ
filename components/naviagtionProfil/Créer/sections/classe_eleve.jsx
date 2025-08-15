import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApplicationContext } from "../../../../context/ApplicationContextProvider";

export default function Classe_eleve({ button }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  const { uid } = useContext(ApplicationContext);
  const colors = [
    "bg-red-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-violet-300",
    "bg-pink-300",
  ];

  const courant = [{ cout: "seance" }];

  const matieres = {
    seance: [
      { icon: "📊", title: "Mathématiques" },
      { icon: "📚", title: "Français" },
    ],
  };

  const descriptionsParMatiere = {
    Mathématiques:
      "Ce chapitre couvre les concepts fondamentaux des mathématiques.",
    Français:
      "Ce chapitre explore les bases de la langue française et de la littérature.",
  };

  const titresParMatiere = {
    Mathématiques: [
      "Les nombres de 0 à 10",
      "Les additions et soustractions",
      "Les formes géométriques",
      "Initiation aux multiplications",
      "Les mesures (longueur, masse, capacité)",
    ],
    Français: [
      "L'alphabet et les sons",
      "Les noms et les verbes",
      "La conjugaison du présent",
      "Les types de phrases",
      "Lecture et compréhension de texte",
    ],
  };

  const [colorCircle, setColorCircle] = useState("");
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isChapitreLoading, setIsChapitreLoading] = useState(false);

  const [classeInputs, setClasseInputs] = useState({
    classe: "",
    identifiant: "",
    description: "",
  });

  const [chapitreInputs, setChapitreInputs] = useState({
    courant: "",
    descChapitre: "",
    classesRome: "",
  });

  const [chapitreInput, setChapitreInput] = useState({
    matiere: [],
  });

  const [titreParMatiere, setTitreParMatiere] = useState({});

  

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["repoData", uid],
    queryFn: async () => {
      const res = await fetch(`${url}/api/getclasse/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      if (!res.ok) throw new Error("Erreur récupération des classes");
      return res.json();
    },
    enabled: !!uid,
  });

  const Classe = data?.table || [];

  const onChangeClasse = (e) => {
    const { name, value } = e.target;
    setClasseInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeChapitre = (e) => {
    const { name, value } = e.target;
    const newValue = value.toLowerCase();
    setChapitreInputs((prev) => ({ ...prev, [name]: newValue }));

    if (name === "courant") {
      const selectedMatieres = matieres[newValue]?.map((m) => m.title) || [];
      setChapitreInput((prev) => ({ ...prev, matiere: selectedMatieres }));
    }
  };

  useEffect(() => {
    if (chapitreInput.matiere.length > 0) {
      const nouveauTitres = {};
      chapitreInput.matiere.forEach((matiere) => {
        const titres = titresParMatiere[matiere] || [];
        const randomTitre =
          titres[Math.floor(Math.random() * titres.length)] || "";
        nouveauTitres[matiere] = randomTitre;
      });

      setTitreParMatiere(nouveauTitres);
      const matiere = chapitreInput.matiere[0];
      setChapitreInputs((prev) => ({
        ...prev,
        descChapitre: descriptionsParMatiere[matiere] || "",
      }));
    }
  }, [chapitreInput.matiere]);

  const addClasse = async () => {
    const { classe, identifiant, description } = classeInputs;
    if (!uid || !classe || !identifiant || !description || !colorCircle) {
      alert("Un ou plusieurs champs sont manquants !");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${url}/api/addclasse/addRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          classe,
          identifiant,
          description,
          couleur: colorCircle,
        }),
      });
      await res.json();
      setClasseInputs({ classe: "", identifiant: "", description: "" });
      setColorCircle("");
      await refetch();
      setToggle(false);
      setChapitreInputs((prev) => ({
        ...prev,
        classesRome: classe,
      }));
    } catch (error) {
      console.error("Erreur ajout classe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addChapitre = async () => {
    if (
      !uid ||
      !chapitreInputs.classesRome ||
      chapitreInput.matiere.length === 0
    ) {
      alert("Un ou plusieurs champs sont manquants !");
      return;
    }

    setIsChapitreLoading(true);
    try {
      const res = await fetch(`${url}/api/addclasse/addchapitres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          classe: chapitreInputs.classesRome,
          mat: chapitreInput.matiere,
          titre: titreParMatiere,
          description: chapitreInputs.descChapitre,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        alert(data.message);
      } else {
        toast.success(data.message);
      }

      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsChapitreLoading(false);
    }
  };

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
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <main>
      {(isLoading || isChapitreLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {isLoading
                  ? "Validation en cours..."
                  : "Création du chapitre en cours..."}
              </h3>
              <p className="text-gray-600 text-sm">Veuillez patienter</p>
            </div>
          </div>
        </div>
      )}

      {toggle ? (
        // FORMULAIRE DE CLASSE
        <section className="bg-white rounded-lg px-3 py-4 shadow-lg grid gap-8 md:w-400 md:rounded-3xl md:py-8">
          <div className="text-lg font-bold md:text-4xl">
            🏫 Créer une nouvelle classe
          </div>
          <div className="grid gap-4 md:grid-cols-2 items-center">
            <label className="grid gap-2">
              <span className="md:text-2xl md:font-semibold">
                Nom de la classe
              </span>
              <input
                onChange={onChangeClasse}
                name="classe"
                value={classeInputs.classe.toUpperCase()}
                placeholder="ex: CP1, CE2, CM2..."
                required
                type="text"
                className="outline-violet-500 rounded-md p-2 md:p-6 md:rounded-2xl md:text-2xl px-3 border border-gray-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="md:text-2xl md:font-semibold">
                Identifiant unique
              </span>
              <input
                name="identifiant"
                onChange={onChangeClasse}
                value={classeInputs.identifiant}
                required
                placeholder="ex: cp1, ce2..."
                type="text"
                className="outline-violet-500 md:p-6 md:rounded-2xl md:text-2xl rounded-md p-2 px-3 border border-gray-400"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="md:text-2xl md:font-semibold">Description</span>
              <textarea
                name="description"
                onChange={onChangeClasse}
                value={classeInputs.description}
                required
                placeholder="Description de la classe..."
                className="outline-violet-500 md:py-10 md:rounded-2xl md:text-2xl rounded-md p-2 px-3 border border-gray-400"
              />
            </label>
          </div>

          <div className="grid gap-2">
            <span className="md:text-2xl md:font-semibold">
              Couleur de la classe
            </span>
            <div className="flex  md:justify-items-start items-center  gap-2">
              {colors.map((clr) => {
                const isActive =
                  clr === colorCircle ? "border-black" : "border-gray-400";

                return (
                  <div
                    onClick={() => setColorCircle(clr)}
                    key={clr}
                    className={`border-2 md:border-4 ${isActive}  btn-circle btn md:p-10 ${clr}`}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 justify-center gap-4 items-center">
            <button
              onClick={button}
              className="bg-gray-500 md:py-4 cursor-pointer md:text-2xl text-white font-bold rounded-4xl px-3 p-1"
            >
              ← Retour
            </button>
            <button
              onClick={addClasse}
              className="bg-green-500 md:py-4 cursor-pointer md:text-2xl text-white font-bold rounded-4xl px-3 p-1"
            >
              Créer la Classe →
            </button>
            <button
              onClick={() => setToggle(false)}
              className="bg-violet-500 md:py-4 cursor-pointer md:text-2xl text-white font-bold rounded-4xl px-3 p-1 col-span-2"
            >
              Ou créer un chapitre →
            </button>
          </div>
        </section>
      ) : (
        // FORMULAIRE DE CHAPITRE
        <section className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto p-4 space-y-6 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl md:rounded-3xl md:p-8 md:space-y-8">
          {/* ✅ Utilisez space-y au lieu de gap pour plus de contrôle */}
          <div className="space-y-4 md:space-y-6">
            <label className="block space-y-2">
              {/* ✅ Mobile-first avec progression logique */}
              <span className="text-base font-medium sm:text-lg md:text-xl lg:text-2xl md:font-semibold">
                Classe
              </span>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-violet-500 sm:text-base md:py-3 md:text-lg lg:py-4 lg:text-xl md:rounded-xl lg:rounded-2xl"
                name="classesRome"
                onChange={onChangeChapitre}
                value={chapitreInputs.classesRome.toUpperCase()}
              >
                <option value="">Sélectionner une classe</option>
                {Classe.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-base font-medium sm:text-lg md:text-xl lg:text-2xl md:font-semibold">
                Matière
              </span>

              <select
                className="w-full px-3 py-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-violet-500 sm:text-base md:py-3 md:text-lg lg:py-4 lg:text-xl md:rounded-xl lg:rounded-2xl"
                name="courant"
                onChange={onChangeChapitre}
                value={chapitreInputs.courant}
              >
                <option value="">Sélectionner le courant</option>
                {courant.map((item, index) => (
                  <option key={index} value={item.cout}>
                    {item.cout}
                  </option>
                ))}
              </select>

              <select
                multiple
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-400 rounded-md bg-gray-100 text-gray-600 min-h-[80px] sm:text-base md:text-lg lg:text-xl md:rounded-xl lg:rounded-2xl md:min-h-[100px]"
                name="matiere"
                value={chapitreInput.matiere}
              >
                {matieres[chapitreInputs.courant]?.map((item) => (
                  <option key={item.title} value={item.title}>
                    {item.icon} {item.title}
                  </option>
                ))}
              </select>
            </label>

            {/* Champs dynamiques de titre */}
            {chapitreInput.matiere.map((matiere) => (
              <label key={matiere} className="block space-y-2">
                <span className="text-base font-medium sm:text-lg md:text-xl lg:text-2xl md:font-semibold">
                  Titre pour {matiere}
                </span>
                <input
                  type="text"
                  value={titreParMatiere[matiere] || ""}
                  onChange={(e) =>
                    setTitreParMatiere((prev) => ({
                      ...prev,
                      [matiere]: e.target.value,
                    }))
                  }
                  placeholder={`ex: Chapitre de ${matiere}`}
                  className="w-full px-3 py-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-violet-500 sm:text-base md:py-3 md:text-lg lg:py-4 lg:text-xl md:rounded-xl lg:rounded-2xl"
                />
              </label>
            ))}

            <label className="block space-y-2">
              <span className="text-base font-medium sm:text-lg md:text-xl lg:text-2xl md:font-semibold">
                Description du chapitre
              </span>
              <textarea
                name="descChapitre"
                onChange={onChangeChapitre}
                value={chapitreInputs.descChapitre}
                required
                placeholder="Description du contenu du chapitre"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-violet-500 resize-vertical min-h-[80px] sm:text-base md:py-4 md:text-lg lg:py-6 lg:text-xl md:rounded-xl lg:rounded-2xl md:min-h-[100px]"
              />
            </label>
          </div>

          {/* Section Aperçu */}
          <div className="rounded-lg p-3 bg-gray-100 space-y-2 md:p-4 md:space-y-3">
            <span className="text-base font-semibold text-violet-500 sm:text-lg md:text-xl lg:text-2xl">
              Aperçu
            </span>
            <div className="bg-white border border-gray-400 rounded-lg p-3 space-y-2 md:p-4 md:space-y-3">
              {chapitreInput.matiere.map((m) => (
                <div key={m}>
                  <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    {m === "Mathématiques" ? "📊" : "📚"}{" "}
                    {titreParMatiere[m] || `Titre ${m}`}
                  </span>
                </div>
              ))}
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                {chapitreInputs.descChapitre}
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => setToggle(true)}
              className="w-full sm:w-auto bg-gray-500 text-white font-bold px-4 py-2 text-sm rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 sm:px-6 md:py-3 md:text-base lg:py-4 lg:text-lg md:rounded-xl lg:rounded-full lg:px-8"
            >
              ← Retour
            </button>
            <button
              onClick={addChapitre}
              className="w-full sm:w-auto bg-violet-500 text-white font-bold px-4 py-2 text-sm rounded-lg hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 sm:px-6 md:py-3 md:text-base lg:py-4 lg:text-lg md:rounded-xl lg:rounded-full lg:px-8"
            >
              Créer
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
