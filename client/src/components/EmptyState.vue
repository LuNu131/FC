<script setup>
const props = defineProps({
  icon: { type: String, default: "📭" },
  title: { type: String, default: "No Data" },
  description: { type: String, default: "Nothing to show here yet" },
  actionText: String,
  actionIcon: String,
});

const emit = defineEmits(["action"]);
</script>

<template>
  <div class="py-20 px-4 text-center">
    <div
      class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-6xl relative overflow-hidden group"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>
      <span
        class="relative z-10 transform group-hover:scale-110 transition-transform duration-300"
        >{{ icon }}</span
      >
    </div>

    <h3 class="text-2xl font-black text-white mb-2">{{ title }}</h3>
    <p class="text-slate-400 mb-8 max-w-md mx-auto">{{ description }}</p>

    <button
      v-if="actionText"
      @click="emit('action')"
      class="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all active:scale-95 inline-flex items-center gap-2"
    >
      <span v-if="actionIcon">{{ actionIcon }}</span>
      <span>{{ actionText }}</span>
    </button>
  </div>
</template>
