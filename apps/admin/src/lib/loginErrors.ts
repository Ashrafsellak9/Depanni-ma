import axios from "axios";

type ApiErrorBody = {
  error?: { code?: string; message?: string };
  message?: string;
};

/** Message générique pour tout échec de connexion (anti-énumération). */
export const GENERIC_LOGIN_ERROR = "Identifiants incorrects";

export const RATE_LIMIT_LOGIN_ERROR = "Trop de tentatives. Réessayez dans 15 minutes.";

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    if (status === 429 || code === "RATE_LIMIT") {
      return RATE_LIMIT_LOGIN_ERROR;
    }
  }

  return GENERIC_LOGIN_ERROR;
}

export function getFieldErrorMessage(
  field: "email" | "password",
  value: string,
  touched: boolean,
): string | undefined {
  if (!touched) return undefined;

  if (field === "email") {
    if (!value.trim()) return "Veuillez saisir votre adresse email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Veuillez saisir une adresse email valide";
    }
  }

  if (field === "password" && !value) {
    return "Le mot de passe est requis";
  }

  return undefined;
}
