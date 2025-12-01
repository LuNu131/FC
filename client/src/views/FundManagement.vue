<script setup>
import { onMounted, ref, computed } from "vue";
import { useFundStore } from "@/stores/fundStore";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

const fundStore = useFundStore();
const authStore = useAuthStore();
const toast = useToastStore();

const showAddForm = ref(false);
const newFund = ref({
  contributorName: "",
  amount: 50000,
  note: "",
});

const isSubmitting = ref(false);

onMounted(() => {
  // Gọi đúng tên hàm trong store
  fundStore.fetchFunds();

  // Tự động điền tên người đóng nếu đang đăng nhập
  if (authStore.user) {
    newFund.value.contributorName = authStore.user.displayName;
  }
});

const handleAddFund = async () => {
  if (!newFund.value.contributorName || !newFund.value.amount) {
    toast.error("Vui lòng điền tên và số tiền!");
    return;
  }

  isSubmitting.value = true;
  const success = await fundStore.createFund(newFund.value);
  isSubmitting.value = false;

  if (success) {
    toast.success("Đã thêm khoản thu thành công! 💰");
    showAddForm.value = false;
    newFund.value = { ...newFund.value, amount: 50000, note: "" }; // Reset form
  } else {
    toast.error("Lỗi khi thêm quỹ");
  }
};

const handleDelete = async (id) => {
  if (!confirm("Bạn chắc chắn muốn xóa khoản này?")) return;
  const success = await fundStore.deleteFund(id);
  if (success) toast.success("Đã xóa thành công");
  else toast.error("Lỗi khi xóa");
};

// Helper format tiền VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
</script>

<template>
  <div class="space-y-8 pb-10">
    <div
      class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-600/20 to-amber-600/10 border border-yellow-500/30 p-8 shadow-2xl"
    >
      <div
        class="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/20 rounded-full blur-[100px]"
      ></div>

      <div
        class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div>
          <h1 class="text-4xl font-black text-white flex items-center gap-3">
            <span class="text-5xl">💰</span> QUỸ ĐỘI BÓNG
          </h1>
          <p class="text-yellow-100/80 mt-2 font-medium">
            Quản lý thu chi minh bạch - Đóng quỹ đầy đủ nhé anh em!
          </p>
        </div>
        <div
          class="text-center md:text-right bg-black/30 p-4 rounded-2xl border border-yellow-500/30 backdrop-blur-sm"
        >
          <p
            class="text-sm text-yellow-400 font-bold uppercase tracking-widest"
          >
            Tổng Số Dư
          </p>
          <p class="text-4xl font-black text-white mt-1 text-shadow-glow">
            {{ formatCurrency(fundStore.totalBalance) }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-white">Lịch sử giao dịch</h3>
      <button
        v-if="authStore.isAdmin"
        @click="showAddForm = !showAddForm"
        class="px-6 py-3 bg-yellow-500 text-black font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 active:scale-95"
      >
        <span v-if="!showAddForm">➕ Thêm khoản thu</span>
        <span v-else>✕ Đóng</span>
      </button>
    </div>

    <div
      v-if="showAddForm"
      class="bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 animate-slide-down"
    >
      <h4
        class="text-yellow-400 font-bold mb-4 uppercase text-sm tracking-wider"
      >
        Nhập thông tin đóng quỹ
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-slate-400 text-xs font-bold mb-1"
            >Người đóng</label
          >
          <input
            v-model="newFund.contributorName"
            type="text"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-colors"
            placeholder="Nhập tên..."
          />
        </div>
        <div>
          <label class="block text-slate-400 text-xs font-bold mb-1"
            >Số tiền (VNĐ)</label
          >
          <input
            v-model="newFund.amount"
            type="number"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-colors"
            placeholder="50000"
          />
        </div>
        <div>
          <label class="block text-slate-400 text-xs font-bold mb-1"
            >Ghi chú</label
          >
          <input
            v-model="newFund.note"
            type="text"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-colors"
            placeholder="Tháng 11..."
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="handleAddFund"
          :disabled="isSubmitting"
          class="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <span v-if="isSubmitting" class="animate-spin">⏳</span>
          Xác nhận nộp tiền
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-if="fundStore.loading" class="text-center py-10">
        <div class="animate-spin text-4xl">⚽</div>
      </div>

      <div
        v-else-if="fundStore.funds.length === 0"
        class="text-center py-10 text-slate-500 italic bg-white/5 rounded-2xl border border-white/5"
      >
        Chưa có giao dịch nào.
      </div>

      <div
        v-else
        v-for="item in fundStore.funds"
        :key="item.id"
        class="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-all hover:translate-x-1 hover:border-white/20"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
          >
            $
          </div>
          <div>
            <p class="font-bold text-white text-lg">
              {{ item.contributor_name }}
            </p>
            <p class="text-sm text-slate-400">
              {{ item.note }} •
              <span class="text-slate-500 text-xs">{{
                new Date(item.created_at).toLocaleDateString("vi-VN")
              }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-green-400 font-black text-lg"
            >+{{ formatCurrency(item.amount) }}</span
          >

          <button
            v-if="authStore.isAdmin"
            @click="handleDelete(item.id)"
            class="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow-glow {
  text-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
}
.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
