<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

// Animation background particles
const particles = ref([]);
onMounted(() => {
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 10 + 10,
  }));
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  loading.value = true;
  error.value = "";

  const res = await authStore.login(username.value, password.value);

  if (res.success) {
    router.push("/");
  } else {
    error.value = res.message;
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 z-0">
      <div
        v-for="p in particles"
        :key="p.id"
        class="absolute rounded-full bg-white/5 animate-float"
        :style="{
          left: p.x + '%',
          top: p.y + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          animationDuration: p.duration + 's',
        }"
      ></div>
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
      ></div>
    </div>

    <div
      class="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
    >
      <div class="p-8">
        <div class="text-center mb-8">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce-slow"
          >
            ⚽
          </div>
          <h1 class="text-3xl font-black text-white mb-2">FC ĐÁ BAY BÓNG</h1>
          <p class="text-gray-300">Đăng nhập hệ thống quản lý</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="group">
            <label class="block text-sm font-bold text-gray-300 mb-1 ml-1"
              >Tài khoản</label
            >
            <div class="relative">
              <input
                v-model="username"
                type="text"
                class="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pl-11 placeholder-gray-500"
                placeholder="Nhập tên đăng nhập"
              />
              <span class="absolute left-3.5 top-3.5 text-gray-400 text-lg"
                >👤</span
              >
            </div>
          </div>

          <div class="group">
            <label class="block text-sm font-bold text-gray-300 mb-1 ml-1"
              >Mật khẩu</label
            >
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pl-11 pr-11 placeholder-gray-500"
                placeholder="••••••••"
              />
              <span class="absolute left-3.5 top-3.5 text-gray-400 text-lg"
                >🔒</span
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors"
              >
                {{ showPassword ? "🙈" : "👁️" }}
              </button>
            </div>
          </div>

          <div
            v-if="error"
            class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center animate-shake"
          >
            <span class="mr-2">⚠️</span> {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span
              v-if="loading"
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            ></span>
            {{ loading ? "Đang xử lý..." : "ĐĂNG NHẬP NGAY 🚀" }}
          </button>
        </form>
      </div>

      <div
        class="bg-black/20 p-4 text-center text-xs text-gray-400 font-medium"
      >
        © 2025 FCDBB Premium System v3.0
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.animate-float {
  animation: float linear infinite;
}
.animate-bounce-slow {
  animation: bounce 2s infinite;
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
