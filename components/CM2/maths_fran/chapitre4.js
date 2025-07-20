const chapitre4_CM2 = {
  Mathématique: [
    {
      id: 1,
      title: "Calcul mental complexe",
      question: "Calcule : (125 × 3) + 75 = ?",
      result: ["450"],
      infoErro: "La bonne réponse était : 450.",
      infosucces: "(125 × 3) + 75 = 450. Excellent raisonnement !",
      type: "input",
    },
    {
      id: 2,
      title: "Division à trois chiffres",
      question: "Calcule : 987 ÷ 3 = ?",
      result: ["329"],
      infoErro: "La bonne réponse était : 329.",
      infosucces: "987 ÷ 3 = 329. Bravo !",
      type: "input",
    },
    {
      id: 3,
      title: "Problème de vitesse",
      question:
        "Une voiture parcourt 150 km en 3 heures. Quelle est sa vitesse ?",
      result: ["50"],
      infoErro: "La bonne réponse était : 50.",
      infosucces: "150 ÷ 3 = 50 km/h. Bien vu !",
      type: "input",
    },
    {
      id: 4,
      title: "Fraction équivalente",
      question: "Complète : 3/5 = ?/10",
      result: ["6"],
      infoErro: "La bonne réponse était : 6.",
      infosucces: "3/5 = 6/10, bien joué !",
      type: "input",
    },
    {
      id: 5,
      title: "Aire d’un rectangle",
      question: "Calcule l’aire d’un rectangle de 12 cm sur 8 cm.",
      result: ["96"],
      infoErro: "La bonne réponse était : 96.",
      infosucces: "Aire = 12 × 8 = 96 cm².",
      type: "input",
    },
  ],
  Français: [
    {
      id: 1,
      title: "Conjugaison - plus-que-parfait",
      question:
        "Conjugue le verbe « aller » à la 1re personne du singulier au plus-que-parfait.",
      result: ["j’étais allé"],
      infoErro: "La bonne réponse était : j’étais allé.",
      infosucces: "Bravo ! J’étais allé est correct.",
      type: "input",
    },
    {
      id: 2,
      title: "Accord du participe passé",
      question:
        "Dans « Elles sont parties en vacances », le mot « parties » est-il bien accordé ?",
      result: ["vrai"],
      infoErro: "La bonne réponse était : vrai.",
      infosucces: "Oui, il est bien accordé au féminin pluriel.",
      type: "booleen",
    },
    {
      id: 3,
      title: "Fonction grammaticale",
      question: "Dans la phrase « L’enfant lit un roman », quel est le COD ?",
      result: ["un roman"],
      infoErro: "La bonne réponse était : un roman.",
      infosucces: "COD = un roman. Très bien !",
      type: "input",
    },
    {
      id: 4,
      title: "Orthographe - confusion",
      question: "Choisis la bonne phrase :",
      result: ["Il s’est couché tard hier soir."],
      infoErro: "La bonne réponse était : Il s’est couché tard hier soir.",
      infosucces: "Bonne maîtrise de l’orthographe grammaticale !",
      type: "choix",
      option: [
        "Il c’est couché tard hier soir.",
        "Il s’est coucher tard hier soir.",
        "Il s’est couché tard hier soir.",
        "Il sait couché tard hier soir.",
      ],
    },
    {
      id: 5,
      title: "Compréhension de texte",
      question:
        "Dans « Le soleil se couchait, les oiseaux rentraient au nid », quelle image est donnée ?",
      result: ["le soir arrive"],
      infoErro: "La bonne réponse était : le soir arrive.",
      infosucces: "Oui ! Cette description évoque le soir.",
      type: "input",
    },
  ],
};

export default chapitre4_CM2;
