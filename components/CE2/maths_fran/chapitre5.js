const chapitre5_CE2 = {
  Mathématique: [
    {
      id: 1,
      title: "Multiplication à deux chiffres",
      question: "Calcule : 34 × 7 = ?",
      result: "238",
      infoErro: "La bonne réponse était : 238.",
      infosucces: "34 × 7 = 238. Bravo !",
      type: "input",
    },
    {
      id: 2,
      title: "Division avec reste",
      question: "Calcule : 95 ÷ 9, quel est le quotient ?",
      result: "10",
      infoErro: "La bonne réponse était : 10.",
      infosucces: "95 ÷ 9 = 10 avec un reste.",
      type: "input",
    },
    {
      id: 3,
      title: "Problème avec fractions simples",
      question:
        "Si tu manges la moitié d’une pizza, quelle fraction reste-t-il ?",
      result: "1/2",
      infoErro: "La bonne réponse était : 1/2.",
      infosucces:
        "La moitié de la pizza reste après avoir mangé l’autre moitié.",
      type: "input",
    },
    {
      id: 4,
      title: "Nombres premiers",
      question: "Le nombre 29 est-il un nombre premier ?",
      result: "vrai",
      infoErro: "La bonne réponse était : vrai.",
      infosucces: "Oui, 29 est un nombre premier.",
      type: "booleen",
    },
    {
      id: 5,
      title: "Suite numérique complexe",
      question: "Complète la suite : 2, 3, 5, 8, 12, __",
      result: "17",
      infoErro: "La bonne réponse était : 17.",
      infosucces: "Chaque nombre est la somme des deux précédents moins 1.",
      type: "input",
    },
  ],
  Français: [
    {
      id: 1,
      title: "Temps composés",
      question:
        "Conjugue le verbe 'être' au plus-que-parfait, 1ère personne du singulier.",
      result: "j’avais été",
      infoErro: "La bonne réponse était : j’avais été.",
      infosucces: "J’avais été est la bonne conjugaison.",
      type: "input",
    },
    {
      id: 2,
      title: "Homophones",
      question:
        "Choisis la bonne orthographe : 'leur' ou 'leurs' dans « Ils ont perdu __ clés. »",
      result: "leurs",
      infoErro: "La bonne réponse était : leurs.",
      infosucces: "Le pluriel 'leurs' est correct.",
      type: "choix",
      option: ["leur", "leurs", "leure", "leurses", "leurre"],
    },
    {
      id: 3,
      title: "Synonymes avancés",
      question: "Donne un synonyme du mot 'difficile'.",
      result: "compliqué",
      infoErro: "La bonne réponse était : compliqué.",
      infosucces: "« Compliqué » est un synonyme de « difficile ». ",
      type: "input",
    },
    {
      id: 4,
      title: "Phrase correcte ?",
      question:
        "La phrase « Nous avions fini nos devoirs hier » est-elle correcte ?",
      result: "vrai",
      infoErro: "La bonne réponse était : vrai.",
      infosucces: "Oui, la phrase est correcte.",
      type: "booleen",
    },
    {
      id: 5,
      title: "Analyse grammaticale avancée",
      question:
        "Dans la phrase « Le garçon à la casquette rouge court vite », quel est le groupe nominal sujet ?",
      result: "Le garçon à la casquette rouge",
      infoErro: "La bonne réponse était : Le garçon à la casquette rouge.",
      infosucces: "C’est le groupe nominal sujet complet.",
      type: "input",
    },
  ],
};

export default chapitre5_CE2;
