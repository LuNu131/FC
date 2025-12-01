<!-- src/components/ToastContainer.vue -->
<script setup>
import { useToastStore } from "@/stores/toastStore";
import ToastNotification from "./ToastNotification.vue";

const toastStore = useToastStore();
</script>

<template>
  <div
    class="fixed top-4 right-4 z-[200] space-y-3 max-w-sm w-full pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-x-4"
      move-class="transition-all duration-300"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <div
          class="shadow-2xl rounded-2xl overflow-hidden border-2"
          :class="{
            'bg-green-50 border-green-200': toast.type === 'success',
            'bg-red-50 border-red-200': toast.type === 'error',
            'bg-yellow-50 border-yellow-200': toast.type === 'warning',
            'bg-blue-50 border-blue-200': toast.type === 'info',
          }"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- Icon -->
              <div
                class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg"
                :class="{
                  'from-green-500 to-emerald-600': toast.type === 'success',
                  'from-red-500 to-rose-600': toast.type === 'error',
                  'from-yellow-500 to-orange-600': toast.type === 'warning',
                  'from-blue-500 to-indigo-600': toast.type === 'info',
                }"
              >
                <span class="text-xl">
                  {{
                    toast.type === "success"
                      ? "✓"
                      : toast.type === "error"
                      ? "✕"
                      : toast.type === "warning"
                      ? "!"
                      : "i"
                  }}
                </span>
              </div>

              <!-- Content -->
              <div class="ml-3 flex-1">
                <p class="text-sm font-bold text-gray-900">
                  {{
                    toast.type === "success"
                      ? "🎉 Thành công!"
                      : toast.type === "error"
                      ? "❌ Lỗi!"
                      : toast.type === "warning"
                      ? "⚠️ Cảnh báo!"
                      : "ℹ️ Thông báo"
                  }}
                </p>
                <p class="mt-1 text-sm text-gray-600">{{ toast.message }}</p>
              </div>

              <!-- Close -->
              <button
                @click="toastStore.removeToast(toast.id)"
                class="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
