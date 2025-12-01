<!-- src/components/ToastNotification.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success", // success, error, warning, info
  },
  duration: {
    type: Number,
    default: 4000,
  },
  show: Boolean,
});

const emit = defineEmits(["close"]);

const icons = {
  success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  warning: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
};

const colors = {
  success: "from-green-500 to-emerald-600",
  error: "from-red-500 to-rose-600",
  warning: "from-yellow-500 to-orange-600",
  info: "from-blue-500 to-indigo-600",
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

let timer = null;
const progress = ref(100);

onMounted(() => {
  if (props.show && props.duration > 0) {
    const interval = 50;
    const step = (interval / props.duration) * 100;

    timer = setInterval(() => {
      progress.value -= step;
      if (progress.value <= 0) {
        clearInterval(timer);
        emit("close");
      }
    }, interval);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 z-[200] max-w-sm w-full shadow-2xl rounded-2xl overflow-hidden"
      :class="bgColors[type]"
    >
      <!-- Progress bar -->
      <div class="h-1 bg-gray-200">
        <div
          class="h-full transition-all duration-100 bg-gradient-to-r"
          :class="colors[type]"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <div class="p-4">
        <div class="flex items-start">
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg"
            :class="colors[type]"
            v-html="icons[type]"
          />

          <!-- Content -->
          <div class="ml-3 flex-1">
            <p class="text-sm font-bold text-gray-900">
              {{
                type === "success"
                  ? "🎉 Thành công!"
                  : type === "error"
                  ? "❌ Lỗi!"
                  : type === "warning"
                  ? "⚠️ Cảnh báo!"
                  : "ℹ️ Thông báo"
              }}
            </p>
            <p class="mt-1 text-sm text-gray-600">{{ message }}</p>
          </div>

          <!-- Close button -->
          <button
            @click="emit('close')"
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
  </Transition>
</template>
