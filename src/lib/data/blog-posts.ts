export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "actualites" | "recettes" | "evenements" | "presse";
  date: string;
  image?: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "nouvelle-ligne-embouteillage-kindia",
    title: "Une nouvelle ligne d'embouteillage à l'usine de Kindia",
    excerpt:
      "Kadi'so investit dans une seconde ligne de production pour répondre à la demande croissante sur Conakry et les régions.",
    category: "actualites",
    date: "2026-05-12",
    content: [
      "L'usine de Kindia accueille désormais une seconde ligne d'embouteillage, dédiée aux eaux et boissons.",
      "Cet investissement permet de réduire les délais de livraison vers Conakry et d'élargir progressivement les zones desservies en région.",
      "Il s'accompagne de la création de quinze postes supplémentaires, recrutés localement.",
    ],
  },
  {
    slug: "trois-recettes-farine-fonio",
    title: "Trois façons de cuisiner la farine de fonio",
    excerpt: "Le fonio se prête à bien plus qu'un accompagnement classique. Voici trois idées simples pour la semaine.",
    category: "recettes",
    date: "2026-04-28",
    image:
      "https://images.unsplash.com/photo-1658431618511-adeba775bd66?auto=format&fit=crop&w=1200&q=80",
    content: [
      "Le fonio cuit en quelques minutes et absorbe bien les saveurs, ce qui en fait une base idéale pour des plats rapides.",
      "En salade tiède avec légumes croquants et citron, en bouillie du matin avec un peu de lait et de miel, ou en accompagnement d'un mafé : le fonio s'adapte à tous les repas de la journée.",
      "Sans gluten et riche en fibres, il convient aussi bien aux enfants qu'aux sportifs.",
    ],
  },
  {
    slug: "kadiso-au-salon-agro-conakry",
    title: "Kadi'so au Salon de l'Agro-industrie de Conakry",
    excerpt: "Retour sur notre participation au salon, l'occasion de présenter notre gamme aux distributeurs régionaux.",
    category: "evenements",
    date: "2026-03-19",
    content: [
      "Kadi'so a tenu un stand au Salon de l'Agro-industrie de Conakry, où l'équipe a pu présenter l'ensemble de la gamme aux visiteurs professionnels.",
      "Plusieurs échanges ont été engagés avec des distributeurs intéressés par une extension de notre réseau en région.",
    ],
  },
  {
    slug: "pourquoi-une-eau-faiblement-mineralisee",
    title: "Pourquoi choisir une eau faiblement minéralisée ?",
    excerpt: "Un point nutrition sur la minéralisation de l'eau et ce qu'elle signifie au quotidien.",
    category: "recettes",
    date: "2026-02-08",
    content: [
      "Une eau faiblement minéralisée convient à une consommation quotidienne pour toute la famille, y compris pour la préparation des biberons.",
      "Notre eau de source est testée régulièrement pour garantir la stabilité de son profil minéral, captée directement dans le Fouta-Djalon.",
    ],
  },
  {
    slug: "campagne-recolte-mangues-2026",
    title: "Lancement de la campagne de récolte des mangues 2026",
    excerpt: "Nos producteurs partenaires de Haute Guinée entament la récolte qui alimentera nos nectars de l'année.",
    category: "actualites",
    date: "2026-01-22",
    image:
      "https://images.unsplash.com/photo-1522120679444-b967faef8c38?auto=format&fit=crop&w=1200&q=80",
    content: [
      "La campagne 2026 démarre avec un objectif d'achat en hausse de 12% par rapport à l'an dernier, au bénéfice direct des coopératives partenaires.",
      "Les prix d'achat sont fixés en amont de la récolte pour donner de la visibilité aux producteurs.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
