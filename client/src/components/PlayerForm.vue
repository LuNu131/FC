<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { usePlayerStore } from "@/stores/playerStore";
import { useRouter, useRoute } from "vue-router";
import { useToastStore } from "@/stores/toastStore";
import axiosClient from "@/api/axiosClient";
import { DEFAULT_TRAITS } from "@/constants/traits";

const props = defineProps({ isEditing: Boolean });
const playerStore = usePlayerStore();
const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const loading = ref(false);
const customTraits = ref([]); // Chứa trait admin tạo thêm từ DB

// Form data chuẩn
const formData = reactive({
  name: "",
  phone: "",
  dob: "",
  height_cm: 0,
  weight_kg: 0,
  position: "Defender",
  jerseyNumber: 0,
  imageUrl: "",
  dominantFoot: "Right",
  pac: 50,
  sho: 50,
  pas: 50,
  dri: 50,
  def: 50,
  phy: 50,
  traits: [],
});

// Gộp trait mặc định (File ảnh có sẵn) + Custom (DB)
const allTraits = computed(() => [...DEFAULT_TRAITS, ...customTraits.value]);

onMounted(async () => {
  // 1. Load Custom Traits từ DB (nếu có)
  try {
    const res = await axiosClient.get("/traits");
    customTraits.value = res.data.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image_url,
      isCustom: true,
    }));
  } catch (e) {
    console.error("Lỗi traits:", e);
  }

  // 2. Load dữ liệu cầu thủ nếu đang sửa
  if (props.isEditing) {
    loading.value = true;
    try {
      const id = route.params.id;
      const p = await playerStore.getPlayerById(id);

      Object.assign(formData, {
        ...p,
        dob: p.dob ? p.dob.split("T")[0] : "", // Fix lỗi format date
        // Parse traits an toàn
        traits:
          typeof p.traits_json === "string"
            ? JSON.parse(p.traits_json)
            : p.traits_json || [],
        // Đảm bảo số là số
        jerseyNumber: Number(p.jerseyNumber),
        height_cm: Number(p.height_cm),
        weight_kg: Number(p.weight_kg),
      });
    } catch (e) {
      toast.error("Lỗi tải dữ liệu!");
      router.push("/players");
    } finally {
      loading.value = false;
    }
  }
});

// Logic chọn Trait: Chỉ 1 Vàng, nhiều Bạc
const toggleTrait = (trait, level) => {
  let current = [...formData.traits];

  // Object trait để lưu
  const traitObj = {
    id: trait.id,
    name: trait.name,
    image: trait.image,
    level,
  };

  if (level === "gold") {
    // Xóa Gold cũ -> Thêm Gold mới
    current = current.filter((t) => t.level !== "gold");
    // Nếu chưa có trait này ở gold thì thêm
    if (!formData.traits.some((t) => t.id === trait.id && t.level === "gold")) {
      current.push(traitObj);
    }
  } else {
    // Toggle Bạc
    const idx = current.findIndex(
      (t) => t.id === trait.id && t.level === "silver"
    );
    if (idx > -1) current.splice(idx, 1);
    else current.push(traitObj);
  }
  formData.traits = current;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Chuẩn hóa dữ liệu (QUAN TRỌNG ĐỂ KHÔNG LỖI 500)
    const payload = {
      ...formData,
      // Ép kiểu số
      pac: Number(formData.pac),
      sho: Number(formData.sho),
      pas: Number(formData.pas),
      dri: Number(formData.dri),
      def: Number(formData.def),
      phy: Number(formData.phy),
      jerseyNumber: Number(formData.jerseyNumber),
      height_cm: Number(formData.height_cm),
      weight_kg: Number(formData.weight_kg),
      // Xử lý ngày rỗng
      dob: formData.dob || null,
      // Traits giữ nguyên mảng object
      traits: formData.traits,
    };

    if (props.isEditing)
      await playerStore.updatePlayer(route.params.id, payload);
    else await playerStore.createPlayer(payload);

    toast.success("Thành công! ⚽");
    router.push("/players");
  } catch (e) {
    console.error(e);
    toast.error("Lỗi: " + (e.response?.data?.error || e.message));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto pt-10 pb-20 px-4">
    <div
      class="bg-slate-900/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10"
    >
      <div
        class="flex justify-between items-center mb-8 pb-6 border-b border-white/10"
      >
        <h2 class="text-3xl font-black text-white flex items-center gap-3">
          <span class="text-4xl">{{ isEditing ? "✏️" : "🆕" }}</span>
          {{ isEditing ? "Cập Nhật Hồ Sơ" : "Thêm Cầu Thủ Mới" }}
        </h2>
        <button
          @click="router.back()"
          class="text-slate-400 hover:text-white font-bold"
        >
          ✕ Hủy bỏ
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="lbl">Họ Tên *</label
            ><input v-model="formData.name" class="inp" required />
          </div>
          <div>
            <label class="lbl">Vị Trí</label>
            <select v-model="formData.position" class="inp">
              <option value="Forward">Tiền đạo</option>
              <option value="Midfielder">Tiền vệ</option>
              <option value="Defender">Hậu vệ</option>
              <option value="Goalkeeper">Thủ môn</option>
            </select>
          </div>
          <div>
            <label class="lbl">Số Áo</label
            ><input
              v-model.number="formData.jerseyNumber"
              type="number"
              class="inp"
            />
          </div>
          <div>
            <label class="lbl">Chân Thuận</label>
            <select v-model="formData.dominantFoot" class="inp">
              <option value="Right">Phải</option>
              <option value="Left">Trái</option>
              <option value="Both">2 Chân</option>
            </select>
          </div>
          <div>
            <label class="lbl">Ngày Sinh</label
            ><input v-model="formData.dob" type="date" class="inp" />
          </div>
          <div class="md:col-span-3">
            <label class="lbl">Link Ảnh Avatar</label
            ><input
              v-model="formData.imageUrl"
              class="inp"
              placeholder="URL ảnh..."
            />
          </div>
        </div>

        <div class="pt-6 border-t border-white/10">
          <h3 class="text-green-400 font-bold mb-4">📊 BỘ CHỈ SỐ (1-99)</h3>
          <div class="grid grid-cols-6 gap-3">
            <div
              v-for="s in ['pac', 'sho', 'pas', 'dri', 'def', 'phy']"
              :key="s"
              class="space-y-1"
            >
              <label
                class="text-center block text-xs font-bold text-slate-500 uppercase"
                >{{ s }}</label
              >
              <input
                v-model.number="formData[s]"
                type="number"
                min="1"
                max="99"
                class="inp text-center font-black text-xl !px-1"
              />
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-white/10">
          <h3 class="text-yellow-400 font-bold mb-2">
            💎 CHỈ SỐ ẨN (PlayStyles)
          </h3>
          <p class="text-slate-500 text-xs mb-4">* Chọn 1 Vàng, nhiều Bạc</p>

          <div
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scroll"
          >
            <div
              v-for="trait in allTraits"
              :key="trait.id"
              class="bg-slate-800 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 group hover:bg-slate-700 transition-all"
            >
              <div
                class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center p-1"
              >
                <img :src="trait.image" class="w-full h-full object-contain" />
              </div>
              <span
                class="text-[10px] font-bold text-slate-300 text-center truncate w-full"
                >{{ trait.name }}</span
              >

              <div class="flex gap-1 w-full mt-1">
                <button
                  type="button"
                  @click="toggleTrait(trait, 'silver')"
                  class="flex-1 py-1 rounded text-[9px] font-bold uppercase border transition-all"
                  :class="
                    formData.traits.some(
                      (t) => t.id === trait.id && t.level === 'silver'
                    )
                      ? 'bg-slate-300 text-black border-slate-300'
                      : 'bg-transparent text-slate-500 border-slate-600 hover:text-white'
                  "
                >
                  Bạc
                </button>
                <button
                  type="button"
                  @click="toggleTrait(trait, 'gold')"
                  class="flex-1 py-1 rounded text-[9px] font-bold uppercase border transition-all"
                  :class="
                    formData.traits.some(
                      (t) => t.id === trait.id && t.level === 'gold'
                    )
                      ? 'bg-yellow-500 text-black border-yellow-500 shadow-glow'
                      : 'bg-transparent text-slate-500 border-slate-600 hover:text-white'
                  "
                >
                  Vàng
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex justify-end pt-6 border-t border-white/10 sticky bottom-0 bg-slate-900/95 p-4 -mx-8 -mb-8 rounded-b-[2.5rem]"
        >
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="loading" class="animate-spin">⏳</span>
            {{ loading ? "Đang xử lý..." : "LƯU THÔNG TIN" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.lbl {
  @apply block text-xs font-bold text-slate-400 mb-1 uppercase;
}
.inp {
  @apply w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all;
}
.shadow-glow {
  box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
}
</style>
