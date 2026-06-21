import * as yup from "yup";

export const productAdminSchema = yup.object({
  name: yup.string().trim().required("Le nom est requis"),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug invalide (lettres minuscules et tirets)")
    .required("Le slug est requis"),
  category: yup.string().required("La catégorie est requise"),
  price: yup.number().typeError("Indiquez un prix").positive("Le prix doit être positif").required(),
  unit: yup.string().trim().required("L'unité est requise (ex : 1 L)"),
  image: yup.string().trim().url("URL d'image invalide").optional().nullable(),
  tagline: yup.string().trim().optional(),
  description: yup.string().trim().optional(),
  inStock: yup.boolean().default(true),
});

export const blogAdminSchema = yup.object({
  title: yup.string().trim().required("Le titre est requis"),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug invalide (lettres minuscules et tirets)")
    .required("Le slug est requis"),
  category: yup.string().required("La catégorie est requise"),
  date: yup.string().required("La date est requise"),
  image: yup.string().trim().url("URL d'image invalide").optional().nullable(),
  excerpt: yup.string().trim().required("Le résumé est requis"),
  content: yup.string().trim().required("Le contenu est requis"),
});

export const zoneAdminSchema = yup.object({
  zone: yup.string().trim().required("La zone est requise"),
  fee: yup.string().trim().required("Les frais sont requis"),
  delay: yup.string().trim().required("Le délai est requis"),
});

export const impactAdminSchema = yup.object({
  totalAmount: yup.number().typeError("Indiquez un montant").min(0).required(),
  note: yup.string().trim().optional(),
});
