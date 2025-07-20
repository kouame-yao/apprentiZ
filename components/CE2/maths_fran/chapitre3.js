const chapitre3_CE2 = {
  Mathématique: [
    {
      id: 1,
      title: "Multiplication à deux chiffres",
      question: "Calcule : 12 × 4 = ?",
      result: ["48"],
      infoErro: "La bonne réponse était : 48.",
      infosucces: "12 × 4 = 48. Bravo !",
      type: "input",
    },
    {
      id: 2,
      title: "Division avec reste",
      question: "Calcule : 29 ÷ 5, quel est le quotient ?",
      result: ["5"],
      infoErro: "La bonne réponse était : 5.",
      infosucces: "29 ÷ 5 = 5 avec un reste, le quotient est 5.",
      type: "input",
    },
    {
      id: 3,
      title: "Problème de partage",
      question:
        "Julie partage 36 bonbons entre 4 amis. Combien reçoit chacun ?",
      result: ["9"],
      infoErro: "La bonne réponse était : 9.",
      infosucces: "36 ÷ 4 = 9 bonbons chacun.",
      type: "input",
    },
    {
      id: 4,
      title: "Vrai ou faux : nombres premiers",
      question: "Le nombre 17 est un nombre premier.",
      result: ["vrai"],
      infoErro: "La bonne réponse était : vrai.",
      infosucces: "Oui, 17 est un nombre premier.",
      type: "booleen",
    },
    {
      id: 5,
      title: "Suite numérique",
      question: "Complète la suite : 2, 4, 8, 16, __",
      result: ["32"],
      infoErro: "La bonne réponse était : 32.",
      infosucces: "Chaque nombre est multiplié par 2.",
      type: "input",
    },
  ],
  Français: [
    {
      id: 1,
      title: "Identification du temps verbal",
      question:
        "Dans la phrase « Elle chantait », quel est le temps du verbe ?",
      result: ["imparfait"],
      infoErro: "La bonne réponse était : imparfait.",
      infosucces: "Le verbe est à l’imparfait.",
      type: "input",
    },
    {
      id: 2,
      title: "Accord sujet-verbe",
      question: "La phrase « Les oiseaux vole » est-elle correcte ?",
      result: ["faux"],
      infoErro: "La bonne réponse était : faux.",
      infosucces:
        "Le verbe doit être « volent » pour s’accorder avec « oiseaux ». ",
      type: "booleen",
    },
    {
      id: 3,
      title: "Synonymes",
      question: "Donne un synonyme de « content ».",
      result: ["heureux"],
      infoErro: "La bonne réponse était : heureux.",
      infosucces: "« Heureux » est un synonyme de « content ». ",
      type: "input",
    },
    {
      id: 4,
      title: "Trouver le complément d’objet",
      question:
        "Dans la phrase « Il mange une pomme », quel est le complément d’objet ?",
      result: ["une pomme"],
      infoErro: "La bonne réponse était : une pomme.",
      infosucces: "« Une pomme » est le complément d’objet.",
      type: "input",
    },
    {
      id: 5,
      title: "Orthographe",
      question: "Quelle est la bonne orthographe ?",
      result: ["papillon"],
      infoErro: "La bonne réponse était : papillon.",
      infosucces: "Le mot correct est papillon.",
      type: "choix",
      option: ["papillon", "papilon", "papilon", "papilion", "papilonn"],
    },
  ],
};

export default chapitre3_CE2;
