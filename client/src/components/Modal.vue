<script setup>
import { onMounted, onUnmounted, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: "Chi Tiết",
  },
  maxWidth: {
    type: String,
    default: "2xl", // sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  centerTitle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  if (props.closeable) {
    emit("close");
  }
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) {
    close();
  }
};

onMounted(() => document.addEventListener("keydown", closeOnEscape));

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
});

watch(
  () => props.show,
  (show) => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }
);

const maxWidthClass = computed(() => {
  return {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    "6xl": "sm:max-w-6xl",
    "7xl": "sm:max-w-7xl",
  }[props.maxWidth];
});
</script>

<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="show"
      class="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-sm transition-opacity"
      @click="close"
    />
  </Transition>

  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-show="show"
      class="fixed inset-0 z-[101] overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center"
    >
      <div
        :class="[
          'relative w-full transition-all transform sm:rounded-2xl shadow-3xl bg-white border border-gray-100',
          maxWidthClass,
        ]"
      >
        <div
          class="flex items-center"
          :class="{
            'justify-center': centerTitle,
            'justify-between': !centerTitle,
          }"
        >
          <div
            class="py-4 px-6 border-b border-gray-200 w-full"
            :class="{ 'text-center': centerTitle }"
          >
            <h3 class="text-xl font-black text-gray-800">
              {{ title }}
            </h3>
          </div>

          <button
            v-if="closeable"
            class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            @click="close"
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

        <div class="p-6">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="p-4 border-t border-gray-200 flex justify-end space-x-3"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.shadow-3xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
