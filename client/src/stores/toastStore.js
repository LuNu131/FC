// src/stores/toastStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref([]);
  let idCounter = 0;

  const addToast = (message, type = "success", duration = 4000) => {
    const id = ++idCounter;
    toasts.value.push({ id, message, type, duration, show: true });

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration + 300);
    }

    return id;
  };

  const removeToast = (id) => {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      toasts.value[idx].show = false;
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, 300);
    }
  };

  // Shorthand methods
  const success = (msg, dur) => addToast(msg, "success", dur);
  const error = (msg, dur) => addToast(msg, "error", dur);
  const warning = (msg, dur) => addToast(msg, "warning", dur);
  const info = (msg, dur) => addToast(msg, "info", dur);

  return { toasts, addToast, removeToast, success, error, warning, info };
});
