import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axiosClient from "@/api/axiosClient";

export const useFundStore = defineStore("fund", () => {
  const funds = ref([]);
  const loading = ref(false);

  // 1. Lấy danh sách quỹ (Đổi tên hàm này cho khớp với logic chung)
  const fetchFunds = async () => {
    loading.value = true;
    try {
      const res = await axiosClient.get("/funds");
      funds.value = res.data;
    } catch (err) {
      console.error("Lỗi tải quỹ:", err);
    } finally {
      loading.value = false;
    }
  };

  // 2. Thêm quỹ mới
  const createFund = async (fundData) => {
    try {
      await axiosClient.post("/funds", fundData);
      await fetchFunds(); // Tải lại danh sách sau khi thêm
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 3. Xóa quỹ
  const deleteFund = async (id) => {
    try {
      await axiosClient.delete(`/funds/${id}`);
      funds.value = funds.value.filter((f) => f.id !== id);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Tính tổng tiền
  const totalBalance = computed(() => {
    return funds.value.reduce((total, item) => total + Number(item.amount), 0);
  });

  // Format hiển thị (ví dụ: 500k, 1.2M)
  const formattedBalance = computed(() => {
    const val = totalBalance.value;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(0) + "k";
    return val.toLocaleString("vi-VN");
  });

  return {
    funds,
    loading,
    fetchFunds, // Quan trọng: Tên hàm này phải khớp với bên View gọi
    createFund,
    deleteFund,
    totalBalance,
    formattedBalance,
  };
});
