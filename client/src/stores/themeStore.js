// src/stores/themeStore.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  // Check localStorage or system preference
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const isDark = ref(getInitialTheme());

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = (dark) => {
    isDark.value = dark;
  };

  // Watch and apply theme
  watch(
    isDark,
    (dark) => {
      localStorage.setItem("theme", dark ? "dark" : "light");
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    { immediate: true }
  );

  return { isDark, toggleTheme, setTheme };
});
