<script setup>
import { onMounted, ref, computed } from "vue";
import { usePlayerStore } from "@/stores/playerStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const playerStore = usePlayerStore();
const authStore = useAuthStore();
const router = useRouter();
const search = ref("");

const filteredPlayers = computed(() => {
  return playerStore.players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (p.jerseyNumber && p.jerseyNumber.toString().includes(search.value))
  );
});

onMounted(() => playerStore.fetchPlayers());
</script>

<template>
  <div class="space-y-6 pb-20">
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h1
        class="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3"
      >
        <span class="text-4xl">⚽</span> Danh Sách Cầu Thủ
      </h1>

      <div class="flex gap-3 w-full md:w-auto">
        <input
          v-model="search"
          placeholder="Tìm tên hoặc số áo..."
          class="form-input flex-1"
        />
        <router-link
          v-if="authStore.isAdmin"
          to="/players/new"
          class="btn-primary whitespace-nowrap px-6 flex items-center gap-2"
        >
          <span>+</span> Thêm
        </router-link>
      </div>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="player in filteredPlayers"
        :key="player.id"
        class="group bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1"
        @click="router.push(`/players/${player.id}`)"
      >
        <div class="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <img
              :src="player.imageUrl || 'https://placehold.co/150'"
              class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-200 shadow-md"
            />
          </div>
        </div>

        <div class="pt-12 pb-6 px-6 text-center">
          <h3 class="text-xl font-black text-gray-800 dark:text-white truncate">
            {{ player.name }}
          </h3>
          <p class="text-indigo-500 font-bold text-sm mb-4">
            {{ player.position }}
          </p>

          <div
            class="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4"
          >
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 dark:text-white text-lg">{{
                player.jerseyNumber || "?"
              }}</span>
              <span class="text-xs uppercase">Số áo</span>
            </div>
            <div class="w-px bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex flex-col">
              <span class="font-bold text-green-600 text-lg">{{
                player.totalAttendance || 0
              }}</span>
              <span class="text-xs uppercase">Tham gia</span>
            </div>
            <div class="w-px bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 dark:text-white text-lg">{{
                player.dob ? new Date(player.dob).getFullYear() : "?"
              }}</span>
              <span class="text-xs uppercase">Năm sinh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
