import { create } from "zustand";

type Theme = "light" | "dark";

interface AppStoreState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
    theme: "light",
    toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    setTheme: (t) => set({ theme: t }),
}));
