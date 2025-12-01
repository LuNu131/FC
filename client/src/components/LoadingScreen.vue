<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
});

const progress = ref(0);

onMounted(() => {
  if (props.show) {
    const interval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 10;
      }
    }, 100);

    return () => clearInterval(interval);
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[120px] animate-float"
        ></div>
        <div
          class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-float-delayed"
        ></div>
      </div>

      <div class="relative z-10 text-center">
        <div class="mb-8 relative">
          <div class="w-32 h-32 mx-auto relative">
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl animate-spin-slow opacity-20"
            ></div>
            <div
              class="absolute inset-2 bg-slate-950 rounded-2xl flex items-center justify-center"
            >
              <span class="text-6xl animate-bounce-slow">⚽</span>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-black text-white mb-2">FC ĐÁ BAY BÓNG</h2>
        <p class="text-slate-400 mb-8">Loading your team data...</p>

        <div class="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div
            class="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300"
            :style="{ width: progress + '%' }"
          >
            <div class="h-full w-full bg-white/30 animate-shimmer"></div>
          </div>
        </div>

        <p class="text-slate-600 text-sm mt-4 font-mono">
          {{ Math.round(progress) }}%
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 8s ease-in-out infinite;
  animation-delay: -4s;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.animate-bounce-slow {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
