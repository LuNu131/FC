<script setup>
import { RouterView, RouterLink, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import ToastContainer from "@/components/ToastContainer.vue";

const router = useRouter();
const authStore = useAuthStore();
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/attendance", label: "Điểm Danh", icon: "📝" },
  { path: "/players", label: "Cầu Thủ", icon: "👕" },
  { path: "/teams", label: "Chia Đội", icon: "🆚" },
  { path: "/fund", label: "Quỹ", icon: "💰" },
];

onMounted(() => {
  window.addEventListener(
    "scroll",
    () => (scrolled.value = window.scrollY > 20)
  );
});
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 text-white font-sans selection:bg-green-500/30 selection:text-green-200 relative overflow-hidden"
  >
    <div
      class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"
    ></div>
    <div
      class="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow delay-1000"
    ></div>

    <ToastContainer />

    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/5',
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/20 py-2'
          : 'bg-transparent py-4',
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <router-link to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-green-500/20 transform group-hover:rotate-12 transition-transform duration-300"
            >
              ⚽
            </div>
            <span class="text-2xl font-black tracking-tighter text-white">
              FCDBB<span class="text-green-400 drop-shadow-glow">.Pro</span>
            </span>
          </router-link>

          <div
            class="hidden md:flex items-center bg-white/5 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-inner"
          >
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-5 py-2 rounded-full font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm relative overflow-hidden group"
              active-class="!text-slate-900 !bg-gradient-to-r from-green-400 to-teal-400 shadow-lg shadow-green-500/30"
            >
              <span class="relative z-10"
                >{{ item.icon }} {{ item.label }}</span
              >
            </router-link>
          </div>

          <div class="hidden md:flex items-center gap-4">
            <div
              v-if="authStore.user"
              class="flex items-center gap-3 pl-4 border-l border-white/10"
            >
              <div class="text-right hidden lg:block">
                <p class="text-sm font-bold text-white">
                  {{ authStore.user.displayName }}
                </p>
                <p class="text-xs text-green-400 font-mono">
                  {{ authStore.user.role }}
                </p>
              </div>
              <div
                class="relative group cursor-pointer"
                @click="authStore.logout()"
              >
                <img
                  :src="authStore.user.avatar || 'https://placehold.co/100'"
                  class="w-10 h-10 rounded-full border-2 border-green-500/50 shadow-md transition-transform group-hover:scale-110 group-hover:border-green-400"
                />
                <div
                  class="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.5)] opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </div>
            </div>
            <router-link
              v-else
              to="/login"
              class="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/30 transition-all"
            >
              Đăng nhập
            </router-link>
          </div>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-white/80 hover:text-white"
          >
            <svg
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md md:hidden"
      @click="mobileMenuOpen = false"
    ></div>
    <div
      :class="[
        'fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-slate-900/90 backdrop-blur-xl border-l border-white/10 z-50 shadow-2xl p-6 transition-transform duration-300 md:hidden flex flex-col',
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="flex justify-between items-center mb-8">
        <span class="text-2xl font-black text-white">Menu</span>
        <button
          @click="mobileMenuOpen = false"
          class="p-2 bg-white/10 rounded-full text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div class="space-y-2 flex-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all"
          active-class="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400 border border-green-500/30"
        >
          <span class="text-2xl">{{ item.icon }}</span> {{ item.label }}
        </router-link>
      </div>
      <button
        @click="authStore.logout()"
        class="mt-auto w-full py-4 bg-red-500/10 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
      >
        🚪 Đăng xuất
      </button>
    </div>

    <main
      class="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12 min-h-screen relative z-10"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
/* Custom animations cho nền và chuyển trang */
.animate-pulse-slow {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.drop-shadow-glow {
  filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5));
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
