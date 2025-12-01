<script setup>
import { computed } from "vue";
import { usePlayerStore } from "@/stores/playerStore";

const playerStore = usePlayerStore();

// Sắp xếp theo số trận tham gia giảm dần
const topPlayers = computed(() => {
  return [...playerStore.players]
    .sort((a, b) => b.totalAttendance - a.totalAttendance)
    .slice(0, 5); // Lấy top 5
});
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-yellow-500/30 p-6 shadow-xl relative overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"
    ></div>

    <h3
      class="text-xl font-black text-yellow-400 mb-6 flex items-center gap-2 uppercase tracking-wider"
    >
      <span>🏆</span> Top Chuyên Cần
    </h3>

    <div class="space-y-4">
      <div
        v-for="(player, index) in topPlayers"
        :key="player.id"
        class="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-8 h-8 flex items-center justify-center font-black rounded-lg text-slate-900 shadow-lg"
            :class="
              index === 0
                ? 'bg-yellow-400'
                : index === 1
                ? 'bg-slate-300'
                : index === 2
                ? 'bg-amber-700'
                : 'bg-slate-700 text-white'
            "
          >
            {{ index + 1 }}
          </div>

          <img
            :src="player.imageUrl || 'https://placehold.co/50'"
            class="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
          />

          <div>
            <p
              class="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors"
            >
              {{ player.name }}
            </p>
            <p class="text-xs text-slate-500 uppercase">
              {{ player.position }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-xl font-black text-white">
            {{ player.totalAttendance }}
          </p>
          <p class="text-[10px] text-slate-500 font-bold uppercase">Trận</p>
        </div>
      </div>
    </div>
  </div>
</template>
