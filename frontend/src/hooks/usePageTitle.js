import { useEffect } from "react";

export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} — Maison Parfumée` : "Maison Parfumée — Parfums de créateurs et essences orientales";
  }, [title]);
};
