<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useToastStore } from "@/stores/toastStore";

const props = defineProps({
  show: Boolean,
  session: Object,
});
const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const attendanceStore = useAttendanceStore();
const playerStore = usePlayerStore();
const toast = useToastStore();

const selectedPlayerToAdd = ref("");

// Lấy danh sách cầu thủ CHƯA điểm danh để Admin add
const availablePlayers = computed(() => {
  if (!props.session) return [];
  const attendedIds = props.session.attendees?.map((p) => p.id) || [];
  return playerStore.players.filter((p) => !attendedIds.includes(p.id));
});

// Admin thêm người
const handleAdminAdd = async () => {
  if (!selectedPlayerToAdd.value) return;
  const success = await attendanceStore.adminCheckIn(
    props.session.id,
    selectedPlayerToAdd.value
  );
  if (success) {
    toast.success("Đã thêm cầu thủ thành công!");
    selectedPlayerToAdd.value = ""; // Reset
  } else {
    toast.error("Lỗi khi thêm cầu thủ");
  }
};

// Admin xóa người
const handleAdminRemove = async (playerId) => {
  if (!confirm("Xóa cầu thủ này khỏi buổi tập?")) return;
  const success = await attendanceStore.adminRemoveCheckIn(
    props.session.id,
    playerId
  );
  if (success) toast.success("Đã xóa khỏi danh sách");
};

// Admin xóa Session
const handleDeleteSession = async () => {
  if (!confirm("CẢNH BÁO: Xóa buổi tập này sẽ mất toàn bộ dữ liệu điểm danh!"))
    return;
  const success = await attendanceStore.deleteSession(props.session.id);
  if (success) {
    toast.success("Đã xóa buổi tập");
    emit("close");
  } else {
    toast.error("Lỗi khi xóa buổi tập");
  }
};

// Toggle Status
const handleToggleStatus = async () => {
  await attendanceStore.toggleStatus(props.session.id, props.session.status);
  toast.success("Đã đổi trạng thái");
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      @click="$emit('close')"
    ></div>

    <div
      class="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-scale-up"
    >
      <div
        class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5"
      >
        <div>
          <h3 class="text-xl font-black text-white">Chi Tiết Buổi Tập</h3>
          <p class="text-sm text-slate-400 mt-1">
            {{ session?.note }} •
            {{ new Date(session?.date).toLocaleDateString("vi-VN") }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ✕
        </button>
      </div>

      <div class="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div
          v-if="authStore.isAdmin"
          class="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 p-5 rounded-2xl space-y-4"
        >
          <h4
            class="text-blue-400 font-black text-xs uppercase tracking-widest flex items-center gap-2"
          >
            🛡️ Admin Control Panel
          </h4>

          <div
            class="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5"
          >
            <span class="text-slate-300 text-sm font-bold"
              >Trạng thái:
              <span
                :class="
                  session.status === 'OPEN'
                    ? 'text-green-400'
                    : 'text-slate-500'
                "
                >{{ session.status }}</span
              >
            </span>
            <button
              @click="handleToggleStatus"
              class="px-3 py-1.5 text-xs font-black rounded-lg border transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
              :class="
                session.status === 'OPEN'
                  ? 'bg-red-500/10 border-red-500 text-red-400'
                  : 'bg-green-500/10 border-green-500 text-green-400'
              "
            >
              {{ session.status === "OPEN" ? "🔒 KHÓA SỔ" : "🔓 MỞ LẠI" }}
            </button>
          </div>

          <div class="flex gap-2">
            <select
              v-model="selectedPlayerToAdd"
              class="flex-1 bg-slate-800 border border-white/20 rounded-xl text-white text-sm px-3 py-2 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="" disabled>-- Chọn cầu thủ thêm --</option>
              <option v-for="p in availablePlayers" :key="p.id" :value="p.id">
                {{ p.name }} (#{{ p.jerseyNumber }})
              </option>
            </select>
            <button
              @click="handleAdminAdd"
              :disabled="!selectedPlayerToAdd"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              + Thêm
            </button>
          </div>
        </div>

        <div>
          <p class="text-white font-bold mb-3 flex justify-between items-end">
            <span>Danh sách tham gia</span>
            <span
              class="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20"
              >{{ session?.attendees?.length || 0 }} người</span
            >
          </p>
          <div class="space-y-2">
            <div
              v-for="p in session?.attendees"
              :key="p.id"
              class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="p.image_url || 'https://placehold.co/50'"
                  class="w-10 h-10 rounded-full bg-slate-800 object-cover border border-white/10"
                />
                <div>
                  <p
                    class="text-sm font-bold text-slate-200 group-hover:text-white"
                  >
                    {{ p.name }}
                  </p>
                  <p class="text-[10px] text-slate-500 font-mono">
                    #{{ p.jersey_number }} • {{ p.position }}
                  </p>
                </div>
              </div>
              <button
                v-if="authStore.isAdmin"
                @click="handleAdminRemove(p.id)"
                class="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Đuổi về :v"
              >
                🗑️
              </button>
            </div>
            <div
              v-if="!session?.attendees?.length"
              class="text-center py-8 border-2 border-dashed border-white/10 rounded-2xl"
            >
              <p class="text-4xl mb-2">🦗</p>
              <p class="text-slate-500 text-sm italic">
                Chưa có ai điểm danh cả...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="authStore.isAdmin"
        class="p-4 border-t border-white/10 bg-white/5"
      >
        <button
          @click="handleDeleteSession"
          class="w-full py-3 text-red-500 font-bold text-sm bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40"
        >
          ☠️ XÓA BUỔI TẬP NÀY
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
