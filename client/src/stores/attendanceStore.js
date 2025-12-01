import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "@/api/axiosClient";
import { usePlayerStore } from "./playerStore";

export const useAttendanceStore = defineStore("attendance", () => {
  const sessions = ref([]);
  const loading = ref(false);

  // 1. Lấy danh sách sessions
  const fetchSessions = async () => {
    loading.value = true;
    try {
      const response = await axiosClient.get("/sessions");
      // Sắp xếp ngày mới nhất lên đầu
      sessions.value = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } catch (err) {
      console.error("Lỗi tải sessions:", err);
    } finally {
      loading.value = false;
    }
  };

  // 2. Tạo buổi tập (Admin) - Gửi kèm secretIconId nếu có
  const createSession = async (data) => {
    loading.value = true;
    try {
      await axiosClient.post("/sessions", data);
      await fetchSessions(); // Refresh lại danh sách ngay
      return true;
    } catch (err) {
      console.error(err);
      // Có thể throw lỗi để component bắt được message
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 3. Tự điểm danh (Player) - UPDATE: Có thêm selectedIconId
  const selfCheckIn = async (sessionId, selectedIconId) => {
    try {
      // Gửi request kèm icon verify
      await axiosClient.post("/sessions/check-in", {
        sessionId,
        selectedIconId,
      });

      // Refresh dữ liệu
      await fetchSessions();

      // Cập nhật lại thông tin player (số trận tham gia tăng lên)
      const playerStore = usePlayerStore();
      await playerStore.fetchPlayers();

      return { success: true };
    } catch (err) {
      console.error(err);
      // Trả về message lỗi từ server (VD: "Sai mã bảo mật", "Đã bị chặn")
      return {
        success: false,
        message: err.response?.data?.message || "Lỗi điểm danh không xác định!",
      };
    }
  };

  // --- CÁC HÀM ADMIN ---

  // 4. Admin điểm danh hộ
  const adminCheckIn = async (sessionId, playerId) => {
    try {
      await axiosClient.post("/sessions/admin/checkin", {
        sessionId,
        playerId,
      });
      await fetchSessions();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 5. Admin xóa người khỏi danh sách
  const adminRemoveCheckIn = async (sessionId, playerId) => {
    try {
      await axiosClient.post("/sessions/admin/remove", { sessionId, playerId });
      await fetchSessions();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 6. Xóa hoàn toàn buổi tập
  const deleteSession = async (sessionId) => {
    try {
      await axiosClient.delete(`/sessions/${sessionId}`);
      sessions.value = sessions.value.filter((s) => s.id !== sessionId);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 7. Đổi trạng thái Đóng/Mở sổ
  const toggleStatus = async (sessionId, currentStatus) => {
    const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await axiosClient.put(`/sessions/${sessionId}/status`, {
        status: newStatus,
      });
      await fetchSessions();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Helper giữ lại để tương thích
  const closeSession = async (sessionId) => {
    return toggleStatus(sessionId, "OPEN");
  };

  return {
    sessions,
    loading,
    fetchSessions,
    createSession,
    selfCheckIn,
    adminCheckIn,
    adminRemoveCheckIn,
    deleteSession,
    toggleStatus,
    closeSession,
  };
});
