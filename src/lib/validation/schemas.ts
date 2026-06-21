import * as yup from "yup";

const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;

export const contactSchema = yup.object({
  name: yup.string().trim().required("Votre nom est requis").min(2, "Nom trop court"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .optional(),
  subject: yup.string().required("Sélectionnez un objet"),
  message: yup
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères")
    .required("Le message est requis"),
});
export type ContactFormValues = yup.InferType<typeof contactSchema>;

export const resellerSchema = yup.object({
  companyName: yup.string().trim().required("La raison sociale est requise"),
  contactName: yup.string().trim().required("Le nom du contact est requis"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le téléphone est requis"),
  city: yup.string().trim().required("La ville est requise"),
  rccm: yup.string().trim().required("Le numéro RCCM est requis"),
  ifu: yup.string().trim().required("Le numéro IFU est requis"),
  message: yup.string().trim().optional(),
});
export type ResellerFormValues = yup.InferType<typeof resellerSchema>;

export const quoteSchema = yup.object({
  companyName: yup.string().trim().required("La raison sociale est requise"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le téléphone est requis"),
  location: yup.string().trim().required("La localisation est requise"),
  products: yup.string().trim().required("Précisez les produits souhaités"),
  quantity: yup
    .number()
    .typeError("Indiquez une quantité")
    .positive("La quantité doit être positive")
    .required("La quantité est requise"),
});
export type QuoteFormValues = yup.InferType<typeof quoteSchema>;

export const newsletterSchema = yup.object({
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
});
export type NewsletterFormValues = yup.InferType<typeof newsletterSchema>;

export const supplierSchema = yup.object({
  fullName: yup.string().trim().required("Votre nom est requis"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le téléphone est requis"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  region: yup.string().trim().required("La région est requise"),
  crop: yup.string().trim().required("Précisez votre production"),
  estimatedVolume: yup.string().trim().required("Indiquez un volume estimé"),
  message: yup.string().trim().optional(),
});
export type SupplierFormValues = yup.InferType<typeof supplierSchema>;

export const checkoutSchema = yup.object({
  fullName: yup.string().trim().required("Le nom complet est requis"),
  phone: yup
    .string()
    .trim()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le téléphone est requis"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  address: yup.string().trim().required("L'adresse de livraison est requise"),
  zone: yup.string().required("Sélectionnez une zone de livraison"),
  paymentMethod: yup.string().required("Sélectionnez un mode de paiement"),
});
export type CheckoutFormValues = yup.InferType<typeof checkoutSchema>;
