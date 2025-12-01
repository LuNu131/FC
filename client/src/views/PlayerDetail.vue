<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import PlayerCard from "@/components/PlayerCard.vue";

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const authStore = useAuthStore();
const toast = useToastStore();
const player = ref(null);

const dobDisplay = computed(() => {
  if (!player.value?.dob) return { date: "N/A", age: "??" };
  const dateObj = new Date(player.value.dob);
  const ageDiff = Date.now() - dateObj.getTime();
  const ageDate = new Date(ageDiff);
  return {
    date: dateObj.toLocaleDateString("vi-VN"),
    age: Math.abs(ageDate.getUTCFullYear() - 1970),
  };
});

const fitnessPercent = computed(() => {
  const maxMatches = 20;
  const current = player.value?.totalAttendance || 0;
  return Math.min((current / maxMatches) * 100, 100);
});

const footNameDisplay = computed(() => {
  switch (player.value?.dominantFoot) {
    case "Right":
      return "Chân Phải";
    case "Left":
      return "Chân Trái";
    case "Both":
      return "Hai chân";
    default:
      return "Chưa rõ";
  }
});

const handleDelete = async () => {
  if (
    !confirm(
      `Xóa cầu thủ ${player.value.name}? Hành động này không thể hoàn tác!`
    )
  )
    return;
  try {
    await playerStore.deletePlayer(player.value.id);
    toast.success("Đã xóa cầu thủ!");
    router.push("/players");
  } catch (err) {
    toast.error("Lỗi xóa: " + (err.response?.data?.message || err.message));
  }
};

onMounted(async () => {
  try {
    player.value = await playerStore.getPlayerById(route.params.id);
  } catch (e) {
    toast.error("Không tìm thấy cầu thủ!");
    router.push("/players");
  }
});
</script>

<template>
  <div
    v-if="player"
    class="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white"
  >
    <div
      class="absolute top-0 left-0 md:left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"
    ></div>
    <div
      class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-10">
        <button
          @click="router.back()"
          class="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group"
        >
          <span class="text-xl group-hover:-translate-x-1 transition-transform"
            >←</span
          >
          <span class="font-bold text-sm tracking-wide">QUAY LẠI</span>
        </button>

        <div v-if="authStore.isAdmin" class="flex gap-3">
          <button
            @click="router.push(`/players/${player.id}/edit`)"
            class="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white flex items-center justify-center transition-all backdrop-blur-md border border-blue-500/30"
          >
            ✏️
          </button>
          <button
            @click="handleDelete"
            class="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all backdrop-blur-md border border-red-500/30"
          >
            🗑️
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div
          class="lg:col-span-5 flex flex-col items-center relative group perspective-container"
        >
          <div
            class="absolute bottom-0 w-64 h-12 bg-black/50 blur-xl rounded-[100%] transform scale-x-150 group-hover:scale-x-125 transition-transform duration-700"
          ></div>

          <div
            class="relative z-20 transform transition-transform duration-500 hover:scale-105 hover:-rotate-2 cursor-pointer"
          >
            <PlayerCard
              :player="player"
              class="shadow-2xl !w-80 !h-[30rem] md:!w-96 md:!h-[34rem]"
            />
          </div>

          <div
            class="mt-8 px-4 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-slate-400"
          >
            PLAYER ID:
            <span class="text-white">{{
              String(player.id).padStart(4, "0")
            }}</span>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-8">
          <div class="relative">
            <h1
              class="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-lg"
            >
              {{ player.name }}
            </h1>
            <div
              class="absolute -top-6 -left-6 text-[10rem] font-black text-white/5 select-none -z-10"
            >
              {{ player.jerseyNumber }}
            </div>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-3xl font-black text-yellow-400"
                >#{{ player.jerseyNumber }}</span
              >
              <div class="h-8 w-[1px] bg-white/20"></div>
              <span
                class="text-xl font-bold text-indigo-400 uppercase tracking-widest"
                >{{ player.position }}</span
              >
            </div>
          </div>

          <div
            class="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm"
          >
            <div class="flex justify-between items-end mb-2">
              <span
                class="text-sm font-bold text-slate-400 uppercase tracking-wider"
                >Độ Chuyên Cần</span
              >
              <span class="text-2xl font-black text-green-400"
                >{{ player.totalAttendance }}
                <span class="text-sm text-slate-500 font-normal"
                  >trận</span
                ></span
              >
            </div>
            <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-green-500 to-emerald-400 relative"
                :style="{ width: `${fitnessPercent}%` }"
              >
                <div
                  class="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"
                ></div>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-2 text-right italic">
              Dữ liệu mùa giải hiện tại
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="stat-box group">
              <div class="stat-icon">🎂</div>
              <div>
                <p class="stat-value">{{ dobDisplay.age }}</p>
                <p class="stat-label">Tuổi</p>
              </div>
            </div>

            <div class="stat-box group">
              <div class="stat-icon">🦶</div>
              <div>
                <p class="stat-value">{{ footNameDisplay }}</p>
                <p class="stat-label">Chân Thuận</p>
              </div>
            </div>

            <div class="stat-box group">
              <div class="stat-icon">📏</div>
              <div>
                <p class="stat-value">
                  {{ player.height_cm || "--" }} <span class="text-xs">cm</span>
                </p>
                <p class="stat-label">Chiều cao</p>
              </div>
            </div>

            <div class="stat-box group">
              <div class="stat-icon">⚖️</div>
              <div>
                <p class="stat-value">
                  {{ player.weight_kg || "--" }} <span class="text-xs">kg</span>
                </p>
                <p class="stat-label">Cân nặng</p>
              </div>
            </div>
          </div>

          <div
            class="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-6 text-sm text-slate-400"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
                >📅</span
              >
              <span
                >Sinh nhật:
                <b class="text-white">{{ dobDisplay.date }}</b></span
              >
            </div>
            <div class="flex items-center gap-3">
              <span
                class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
                >📞</span
              >
              <span
                >Liên hệ:
                <b class="text-white font-mono">{{
                  player.phone || "N/A"
                }}</b></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom Class cho ô thông số */
.stat-box {
  @apply bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition-all hover:bg-white/10 hover:border-indigo-500/30 hover:-translate-y-1;
}
.stat-icon {
  @apply w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner;
}
.stat-value {
  @apply text-xl font-black text-white leading-none;
}
.stat-label {
  @apply text-[10px] font-bold text-slate-500 uppercase mt-1;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
