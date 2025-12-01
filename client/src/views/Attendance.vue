<script setup>
import { ref, onMounted, computed } from "vue";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { VERIFY_ICONS } from "@/constants/icons";
import axiosClient from "@/api/axiosClient";
import Modal from "@/components/Modal.vue";

const attendanceStore = useAttendanceStore();
const authStore = useAuthStore();
const toast = useToastStore();

const newSession = ref({
  date: new Date().toISOString().split("T")[0],
  note: "",
});
const selectedSecretIcon = ref("");
const showVerifyModal = ref(false);
const verifyOptions = ref([]);
const selectedVerifyIcon = ref("");
const targetSessionId = ref("");

// Chia list thành 2 phần
const activeSessions = computed(() =>
  attendanceStore.sessions.filter((s) => s.status === "OPEN")
);
const historySessions = computed(() =>
  attendanceStore.sessions.filter((s) => s.status !== "OPEN")
);

const isCheckedIn = (session) => {
  if (!authStore.user?.playerId) return false;
  return session.attendees?.some((p) => p.id === authStore.user.playerId);
};

const handleCreateSession = async () => {
  if (!newSession.value.date || !selectedSecretIcon.value)
    return toast.warning("Chọn Ngày & Icon bảo mật!");

  const success = await attendanceStore.createSession({
    ...newSession.value,
    secretIconId: selectedSecretIcon.value,
  });

  if (success) {
    toast.success("Mở cổng điểm danh thành công!");
    newSession.value.note = "";
    selectedSecretIcon.value = "";
  }
};

const openVerifyModal = async (sessionId) => {
  targetSessionId.value = sessionId;
  showVerifyModal.value = true;
  selectedVerifyIcon.value = "";
  try {
    const res = await axiosClient.get(
      `/sessions/verify-options?sessionId=${sessionId}`
    );
    verifyOptions.value = res.data;
  } catch (e) {
    toast.error(
      "Lỗi: " + (e.response?.data?.message || "Không tải được options")
    );
    showVerifyModal.value = false;
  }
};

const submitCheckIn = async () => {
  if (!selectedVerifyIcon.value) return toast.warning("Chọn 1 hình đi!");
  const res = await attendanceStore.selfCheckIn(
    targetSessionId.value,
    selectedVerifyIcon.value
  );
  if (res.success) {
    toast.success("Điểm danh thành công! ✅");
    showVerifyModal.value = false;
  } else {
    toast.error(res.message);
    showVerifyModal.value = false;
  }
};

// Gọi fetchSessions khi vào trang
onMounted(() => attendanceStore.fetchSessions());
</script>

<template>
  <div class="space-y-6 pb-24 px-2 md:px-0">
    <div
      class="bg-gradient-to-br from-green-600 to-teal-700 rounded-[2.5rem] p-8 shadow-xl text-white relative"
    >
      <h1 class="text-3xl md:text-5xl font-black flex items-center mb-2">
        <span class="mr-4 text-4xl md:text-6xl">📅</span> ĐIỂM DANH
      </h1>
    </div>

    <div
      v-if="authStore.isAdmin"
      class="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-red-500/30"
    >
      <h3 class="text-xl font-bold text-white mb-4">🔐 Tạo Buổi Tập (Admin)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          v-model="newSession.date"
          type="date"
          class="form-input bg-slate-800 text-white border-slate-700"
        />
        <input
          v-model="newSession.note"
          placeholder="Ghi chú..."
          class="form-input bg-slate-800 text-white border-slate-700"
        />
      </div>
      <p class="text-slate-400 text-sm mb-2 font-bold uppercase">
        Chọn Mật Mã:
      </p>
      <div class="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
        <div
          v-for="icon in VERIFY_ICONS"
          :key="icon.id"
          @click="selectedSecretIcon = icon.id"
          class="aspect-square bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all"
          :class="
            selectedSecretIcon === icon.id
              ? 'border-green-500 bg-green-500/20'
              : 'border-transparent'
          "
        >
          <span class="text-2xl">{{ icon.img }}</span>
        </div>
      </div>
      <button
        @click="handleCreateSession"
        class="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl"
      >
        ＋ MỞ CỔNG (CÓ VERIFY)
      </button>
    </div>

    <div v-if="activeSessions.length > 0" class="space-y-4">
      <h3 class="text-xl font-bold text-green-400 px-2 flex items-center gap-2">
        <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        Đang Mở
      </h3>
      <div
        v-for="session in activeSessions"
        :key="session.id"
        class="bg-slate-800 rounded-3xl shadow-xl border border-green-500/30 p-6"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h4 class="text-3xl font-black text-white mb-1">
              {{ new Date(session.date).toLocaleDateString("vi-VN") }}
            </h4>
            <p class="text-green-400 font-medium text-lg">
              {{ session.note || "Buổi tập thường" }}
            </p>
          </div>
          <span
            class="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-black rounded-full"
            >OPEN</span
          >
        </div>
        <button
          v-if="!isCheckedIn(session)"
          @click="openVerifyModal(session.id)"
          class="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>🕵️</span> BÁO DANH NGAY
        </button>
        <div
          v-else
          class="w-full py-4 bg-green-900/30 text-green-400 font-bold rounded-2xl border border-green-500/30 flex items-center justify-center gap-2"
        >
          <span class="text-xl">✅</span> Bạn đã có mặt
        </div>

        <div class="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          <img
            v-for="p in session.attendees"
            :key="p.id"
            :src="p.image_url || 'https://placehold.co/100'"
            class="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            :title="p.name"
          />
        </div>
      </div>
    </div>

    <div v-if="historySessions.length > 0" class="mt-10">
      <h3 class="text-xl font-bold text-slate-400 mb-4 px-2">Lịch Sử</h3>
      <div class="space-y-3">
        <div
          v-for="session in historySessions"
          :key="session.id"
          class="bg-slate-800/50 p-5 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition-colors"
        >
          <div>
            <div class="font-bold text-white text-lg">
              {{ new Date(session.date).toLocaleDateString("vi-VN") }}
            </div>
            <div class="text-sm text-slate-500">{{ session.note }}</div>
          </div>
          <div class="text-right">
            <div class="text-base font-bold text-indigo-400">
              {{ session.attendees?.length || 0 }} người
            </div>
            <div class="text-[10px] text-slate-500 uppercase font-bold">
              Đã chốt
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="
        activeSessions.length === 0 &&
        historySessions.length === 0 &&
        !attendanceStore.loading
      "
      class="text-center py-20 text-slate-500"
    >
      <div class="text-6xl mb-4">📭</div>
      <p>Chưa có dữ liệu buổi tập nào.</p>
    </div>

    <Modal :show="showVerifyModal" @close="showVerifyModal = false">
      <div class="p-6 text-center">
        <h2 class="text-2xl font-black text-slate-900 mb-2">TRUY TÌM MẬT MÃ</h2>
        <p class="text-slate-600 mb-6 text-sm font-medium">
          Chọn sai 1 lần là
          <span class="text-red-600 font-bold">RA ĐẢO</span> ngay!
        </p>
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div
            v-for="opt in verifyOptions"
            :key="opt.id"
            @click="selectedVerifyIcon = opt.id"
            class="aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer border-4 transition-all hover:scale-105"
            :class="
              selectedVerifyIcon === opt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-slate-50'
            "
          >
            <span class="text-5xl mb-2">{{ opt.img }}</span>
            <span class="text-xs font-bold text-slate-500">{{ opt.name }}</span>
          </div>
        </div>
        <button
          @click="submitCheckIn"
          class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
        >
          CHỐT ĐÁP ÁN 🚀
        </button>
      </div>
    </Modal>
  </div>
</template>
