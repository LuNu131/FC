<script setup>
import { ref, onMounted } from "vue";
import axiosClient from "@/api/axiosClient";
import { useToastStore } from "@/stores/toastStore";

const toast = useToastStore();
const newTrait = ref({ name: "", imageUrl: "", description: "" });
const customTraits = ref([]);

const fetchTraits = async () => {
  const res = await axiosClient.get("/traits");
  customTraits.value = res.data;
};

const handleCreate = async () => {
  if (!newTrait.value.name || !newTrait.value.imageUrl)
    return toast.warning("Nhập tên và link ảnh!");

  try {
    await axiosClient.post("/traits", newTrait.value);
    toast.success("Tạo trait thành công!");
    newTrait.value = { name: "", imageUrl: "", description: "" };
    fetchTraits();
  } catch (e) {
    toast.error("Lỗi: " + e.message);
  }
};

onMounted(fetchTraits);
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="bg-slate-900 p-8 rounded-3xl border border-white/10">
      <h2 class="text-2xl font-black text-white mb-6">🛠️ Tạo Chỉ Số Ẩn Mới</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <input
            v-model="newTrait.name"
            placeholder="Tên Trait (VD: Sút Xa)"
            class="form-input"
          />
          <input
            v-model="newTrait.imageUrl"
            placeholder="Link Ảnh Icon (URL)"
            class="form-input"
          />
          <input
            v-model="newTrait.description"
            placeholder="Mô tả (tùy chọn)"
            class="form-input"
          />
          <button
            @click="handleCreate"
            class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg"
          >
            + THÊM VÀO DATABASE
          </button>
        </div>
        <div
          class="flex flex-col items-center justify-center bg-slate-800 rounded-2xl border border-white/5 p-4"
        >
          <p class="text-slate-400 text-xs font-bold uppercase mb-2">
            Xem Trước
          </p>
          <img
            :src="newTrait.imageUrl || 'https://placehold.co/100'"
            class="w-20 h-20 object-contain mb-2"
          />
          <span class="text-white font-bold">{{
            newTrait.name || "Tên Trait"
          }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="t in customTraits"
        :key="t.id"
        class="bg-white/5 p-4 rounded-xl flex items-center gap-3 border border-white/5"
      >
        <img :src="t.image_url" class="w-10 h-10 object-contain" />
        <span class="text-white font-bold text-sm">{{ t.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-green-500;
}
</style>
