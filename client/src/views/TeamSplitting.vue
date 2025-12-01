<script setup>
import { onMounted } from "vue";
import { useTeamStore } from "@/stores/teamStore";
import { useRouter } from "vue-router";

const teamStore = useTeamStore();
const router = useRouter();

onMounted(() => {
  teamStore.fetchTeams();
});

// Mapping màu hex sang class Tailwind và màu shadow
const getTeamStyles = (hex) => {
  const map = {
    "#10b981": {
      color: "emerald",
      shadow: "shadow-emerald-500/40",
      border: "border-emerald-500/50",
      bgAccent: "bg-emerald-500/10",
    },
    "#ef4444": {
      color: "rose",
      shadow: "shadow-rose-500/40",
      border: "border-rose-500/50",
      bgAccent: "bg-rose-500/10",
    },
    "#f59e0b": {
      color: "amber",
      shadow: "shadow-amber-500/40",
      border: "border-amber-500/50",
      bgAccent: "bg-amber-500/10",
    },
    "#a855f7": {
      color: "purple",
      shadow: "shadow-purple-500/40",
      border: "border-purple-500/50",
      bgAccent: "bg-purple-500/10",
    },
  };
  return map[hex] || map["#10b981"];
};
</script>

<template>
  <div class="space-y-8 pb-10">
    <div
      class="relative overflow-hidden rounded-[2.5rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 text-white isolate shadow-2xl"
    >
      <div
        class="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/30 rounded-full blur-[150px] -z-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/30 rounded-full blur-[150px] -z-10 animate-pulse-slow delay-700"
      ></div>

      <div
        class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div>
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-glow"
          >
            ĐỘI HÌNH THI ĐẤU
          </h1>
          <p
            class="text-slate-300 text-xl font-medium max-w-2xl leading-relaxed"
          >
            Danh sách chia đội chính thức. Hãy chiến đấu hết mình vì màu cờ sắc
            áo! 🔥
          </p>
        </div>
        <div class="flex gap-4">
          <button
            class="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-3 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 group"
          >
            <span class="text-2xl group-hover:rotate-12 transition-transform"
              >📥</span
            >
            <span>Xuất ảnh đội hình</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="teamStore.loading"
      class="flex flex-col items-center justify-center py-32"
    >
      <div class="relative w-24 h-24">
        <div
          class="absolute inset-0 border-4 border-blue-500/20 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
      <p
        class="mt-6 text-slate-400 font-bold text-lg animate-pulse tracking-wider"
      >
        ĐANG TẢI DỮ LIỆU...
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      <div
        v-for="team in teamStore.teams"
        :key="team.id"
        :class="`group relative bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3 overflow-hidden border-2 ${
          getTeamStyles(team.color_hex).border
        } flex flex-col h-full hover:${
          getTeamStyles(team.color_hex).shadow
        } shadow-xl`"
      >
        <div
          :class="`absolute inset-0 bg-gradient-to-b from-${
            getTeamStyles(team.color_hex).color
          }-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`"
        ></div>

        <div :class="`relative p-8 pb-16 overflow-hidden`">
          <div
            :class="`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-${
              getTeamStyles(team.color_hex).color
            }-500/10 to-transparent -z-10`"
          ></div>

          <div class="relative z-10 text-center">
            <div
              :class="`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/50 border ${
                getTeamStyles(team.color_hex).border
              } mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg ${
                getTeamStyles(team.color_hex).shadow
              }`"
            >
              <span class="text-5xl drop-shadow-lg">🛡️</span>
            </div>
            <h3
              :class="`text-3xl font-black text-${
                getTeamStyles(team.color_hex).color
              }-400 uppercase tracking-wider drop-shadow-sm`"
            >
              {{ team.name }}
            </h3>
            <div
              :class="`inline-block px-4 py-1 rounded-full ${
                getTeamStyles(team.color_hex).bgAccent
              } border ${getTeamStyles(team.color_hex).border} mt-3`"
            >
              <p
                :class="`text-${
                  getTeamStyles(team.color_hex).color
                }-300 text-sm font-bold`"
              >
                {{ team.memberCount }} Chiến Binh
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 -mt-10 relative z-20 mb-4">
          <div
            :class="`bg-slate-800/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border ${
              getTeamStyles(team.color_hex).border
            } flex items-center gap-4 transform transition-all hover:scale-[1.03] cursor-pointer group/captain hover:bg-slate-800`"
            @click="router.push(`/players/${team.captain_id}`)"
          >
            <div class="relative">
              <img
                :src="team.captain_image || 'https://placehold.co/100'"
                class="w-14 h-14 rounded-2xl object-cover border-2 border-yellow-400/80 shadow-md"
              />
              <div
                class="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-sm border border-yellow-300 animate-bounce-slow"
              >
                👑
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1"
              >
                Đội trưởng
              </p>
              <p
                class="text-lg font-black text-white truncate group-hover/captain:text-yellow-300 transition-colors"
              >
                {{ team.captain_name }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="p-6 pt-0 flex-1 overflow-y-auto max-h-[450px] scrollbar-hide relative z-10"
        >
          <div class="space-y-3">
            <div
              v-for="member in team.members"
              :key="member.id"
              v-show="member.id !== team.captain_id"
              :class="`flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:${
                getTeamStyles(team.color_hex).border
              } group/member`"
              @click="router.push(`/players/${member.id}`)"
            >
              <div
                :class="`w-10 h-10 rounded-xl ${
                  getTeamStyles(team.color_hex).bgAccent
                } border ${getTeamStyles(team.color_hex).border} text-${
                  getTeamStyles(team.color_hex).color
                }-400 flex items-center justify-center font-black text-sm shadow-sm group-hover/member:scale-110 transition-transform`"
              >
                {{ member.jersey_number }}
              </div>
              <div class="flex-1">
                <p
                  class="font-bold text-slate-200 text-base group-hover/member:text-white"
                >
                  {{ member.name }}
                </p>
                <p
                  class="text-[11px] text-slate-500 font-bold uppercase tracking-wider"
                >
                  {{ member.position }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-4 bg-slate-900/50 border-t border-white/5 text-center text-xs text-slate-500 font-bold uppercase tracking-widest relative z-10"
        >
          FCDBB Arena • {{ team.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
</style>
