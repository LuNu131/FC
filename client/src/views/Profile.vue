<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useToastStore } from "@/stores/toastStore";
import { DEFAULT_TRAITS } from "@/constants/traits";
import axiosClient from "@/api/axiosClient";
import PlayerCard from "@/components/PlayerCard.vue";

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const toast = useToastStore();

const loading = ref(false);
const customTraits = ref([]);
const playerData = ref({
  pac: 50,
  sho: 50,
  pas: 50,
  dri: 50,
  def: 50,
  phy: 50,
  traits: [],
  name: "",
  position: "Defender",
  jerseyNumber: 0,
  imageUrl: "",
});

// Gộp Default + Custom
const allTraits = computed(() => [...DEFAULT_TRAITS, ...customTraits.value]);

onMounted(async () => {
  // Load Custom Traits từ DB
  try {
    const res = await axiosClient.get("/traits");
    customTraits.value = res.data.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image_url,
      isCustom: true,
    }));
  } catch (e) {
    console.error(e);
  }

  // Load Player Data
  await playerStore.fetchPlayers();
  const pid = authStore.user?.playerId;
  if (pid) {
    const p = playerStore.players.find((x) => x.id === pid);
    if (p) {
      playerData.value = { ...p };
      // Parse Traits JSON
      if (typeof p.traits_json === "string") {
        try {
          playerData.value.traits = JSON.parse(p.traits_json);
        } catch (e) {
          playerData.value.traits = [];
        }
      } else {
        playerData.value.traits = p.traits_json || [];
      }
      if (p.dob) playerData.value.dob = p.dob.split("T")[0];
    }
  }
});

// Logic chọn Trait (1 Vàng, nhiều Bạc)
const toggleTrait = (trait, level) => {
  let current = [...(playerData.value.traits || [])];

  if (level === "gold") {
    // Xóa trait vàng cũ (nếu có)
    current = current.filter((t) => t.level !== "gold");
    // Nếu chưa có trait này ở level gold thì thêm
    if (
      !playerData.value.traits?.some(
        (t) => t.id === trait.id && t.level === "gold"
      )
    ) {
      current.push({
        id: trait.id,
        name: trait.name,
        image: trait.image,
        level: "gold",
      });
    }
  } else {
    // Toggle Bạc
    const idx = current.findIndex(
      (t) => t.id === trait.id && t.level === "silver"
    );
    if (idx > -1) current.splice(idx, 1); // Xóa nếu đang chọn
    else
      current.push({
        id: trait.id,
        name: trait.name,
        image: trait.image,
        level: "silver",
      });
  }
  playerData.value.traits = current;
};

const handleUpdate = async () => {
  loading.value = true;
  try {
    // Ép kiểu số trước khi gửi
    const payload = {
      ...playerData.value,
      pac: Number(playerData.value.pac),
      sho: Number(playerData.value.sho),
      pas: Number(playerData.value.pas),
      dri: Number(playerData.value.dri),
      def: Number(playerData.value.def),
      phy: Number(playerData.value.phy),
      jerseyNumber: Number(playerData.value.jerseyNumber),
      traits: playerData.value.traits,
    };

    await playerStore.updatePlayer(playerData.value.id, payload);
    toast.success("Đã lưu hồ sơ cầu thủ!");
  } catch (e) {
    toast.error("Lỗi: " + (e.response?.data?.message || e.message));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="max-w-7xl mx-auto pb-20 pt-6 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8"
  >
    <div
      class="lg:col-span-4 flex flex-col items-center gap-6 sticky top-24 h-fit"
    >
      <h3 class="text-white font-bold text-xl uppercase tracking-widest">
        Thẻ Của Bạn
      </h3>
      <PlayerCard :player="playerData" size="large" />
      <button
        @click="handleUpdate"
        :disabled="loading"
        class="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all active:scale-95 disabled:opacity-50"
      >
        {{ loading ? "ĐANG LƯU..." : "LƯU THAY ĐỔI" }}
      </button>
    </div>

    <div class="lg:col-span-8 space-y-8">
      <div
        class="bg-slate-900/80 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md"
      >
        <h3 class="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <span class="text-3xl">📊</span> TÙY CHỈNH CHỈ SỐ
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div
            v-for="stat in ['pac', 'sho', 'pas', 'dri', 'def', 'phy']"
            :key="stat"
          >
            <div class="flex justify-between mb-3 items-end">
              <label
                class="font-black text-slate-400 text-sm uppercase tracking-widest"
                >{{ stat }}</label
              >
              <span class="font-black text-3xl text-green-400">{{
                playerData[stat]
              }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="99"
              v-model.number="playerData[stat]"
              class="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
            />
          </div>
        </div>
      </div>

      <div
        class="bg-slate-900/80 p-8 rounded-[2rem] border border-yellow-500/30 shadow-2xl backdrop-blur-md"
      >
        <h3
          class="text-2xl font-black text-yellow-400 mb-2 flex items-center gap-3"
        >
          <span class="text-3xl">💎</span> PLAYSTYLES
        </h3>
        <p class="text-slate-400 font-medium mb-8">
          Chọn tối đa 1
          <span class="text-yellow-400 font-bold">PlayStyle+ (Vàng)</span> và
          nhiều PlayStyle thường (Bạc).
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="trait in allTraits"
            :key="trait.id"
            class="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 relative transition-all hover:bg-slate-700 hover:scale-105 group"
          >
            <img
              :src="trait.image"
              class="w-12 h-12 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform"
            />
            <span
              class="text-xs font-bold text-center text-slate-300 h-8 flex items-center justify-center w-full"
              >{{ trait.name }}</span
            >

            <div class="flex gap-2 w-full mt-auto">
              <button
                @click="toggleTrait(trait, 'silver')"
                class="flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border"
                :class="
                  playerData.traits?.some(
                    (t) => t.id === trait.id && t.level === 'silver'
                  )
                    ? 'bg-slate-300 text-slate-900 border-slate-300 shadow-md scale-105'
                    : 'bg-transparent text-slate-500 border-slate-600 hover:bg-slate-600 hover:text-white'
                "
              >
                Bạc
              </button>

              <button
                @click="toggleTrait(trait, 'gold')"
                class="flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border"
                :class="
                  playerData.traits?.some(
                    (t) => t.id === trait.id && t.level === 'gold'
                  )
                    ? 'bg-yellow-500 text-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-105'
                    : 'bg-transparent text-slate-500 border-slate-600 hover:bg-slate-600 hover:text-white'
                "
              >
                Vàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200"
      >
        <h3
          class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"
        >
          <span>📝</span> CƠ BẢN
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase"
              >Họ và Tên</label
            >
            <input v-model="playerData.name" class="form-input" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase"
              >Số Áo</label
            >
            <input
              v-model.number="playerData.jerseyNumber"
              type="number"
              class="form-input"
            />
          </div>
          <div class="md:col-span-2 space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase"
              >Link Ảnh Avatar</label
            >
            <input
              v-model="playerData.imageUrl"
              class="form-input"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply w-full bg-slate-100 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all;
}
</style>
