<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  player: Object,
  size: { type: String, default: "normal" },
});

// Logic tính toán 3D Tilt
const cardRef = ref(null);
const rotation = ref({ x: 0, y: 0 });
const glare = ref({ x: 50, y: 50, opacity: 0 });

const handleMouseMove = (e) => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Tính toán độ nghiêng
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  rotation.value = {
    x: ((y - centerY) / centerY) * -12, // Nghiêng tối đa 12 độ
    y: ((x - centerX) / centerX) * 12,
  };

  // Tính vị trí vệt sáng
  glare.value = {
    x: (x / rect.width) * 100,
    y: (y / rect.height) * 100,
    opacity: 1,
  };
};

const handleMouseLeave = () => {
  rotation.value = { x: 0, y: 0 };
  glare.value.opacity = 0;
};

// Tính OVR và Traits
const overall = computed(() => {
  if (!props.player) return 50;
  const { pac, sho, pas, dri, def, phy } = props.player;
  const stats = [pac, sho, pas, dri, def, phy].map((v) => Number(v) || 50);
  return Math.round(stats.reduce((a, b) => a + b, 0) / 6);
});

const traits = computed(() => {
  try {
    return typeof props.player.traits_json === "string"
      ? JSON.parse(props.player.traits_json)
      : props.player.traits_json || [];
  } catch {
    return [];
  }
});

const goldTrait = computed(() => traits.value.find((x) => x.level === "gold"));
const silverTraits = computed(() =>
  traits.value.filter((x) => x.level === "silver").slice(0, 3)
);

// Dynamic Class cho Rank
const cardRankClass = computed(() => {
  if (overall.value >= 80) return "rank-gold";
  if (overall.value >= 70) return "rank-silver";
  return "rank-bronze";
});
</script>

<template>
  <div
    ref="cardRef"
    class="relative select-none font-sans text-[#432f1e] cursor-pointer group perspective-1000 z-10"
    :class="{
      'w-64 h-[24rem]': size === 'normal',
      'w-80 h-[30rem]': size === 'large',
      'w-32 h-[12rem] text-[0.5rem]': size === 'small',
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="w-full h-full transition-transform duration-100 ease-out preserve-3d shadow-2xl rounded-t-[15%] rounded-b-[10%]"
      :style="{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }"
    >
      <div
        class="absolute inset-0 rounded-t-[15%] rounded-b-[10%] border-[6px] overflow-hidden bg-cover bg-center"
        :class="{
          'border-[#e3b956] bg-gradient-to-br from-[#f9f1d0] via-[#fdfbf3] to-[#cc9b30]':
            cardRankClass === 'rank-gold',
          'border-[#a8a8a8] bg-gradient-to-br from-[#e0e0e0] via-[#f5f5f5] to-[#8a8a8a]':
            cardRankClass === 'rank-silver',
          'border-[#cd7f32] bg-gradient-to-br from-[#eecfa1] via-[#fff8dc] to-[#8b4513]':
            cardRankClass === 'rank-bronze',
        }"
      >
        <div
          class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"
        ></div>

        <div
          class="absolute inset-0 z-50 pointer-events-none mix-blend-soft-light transition-opacity duration-200"
          :style="{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            opacity: glare.opacity,
          }"
        ></div>
      </div>

      <div
        class="absolute top-[8%] left-1/2 -translate-x-1/2 w-[90%] h-[55%] z-10 transition-transform duration-200 transform translate-z-10 group-hover:scale-105"
      >
        <img
          :src="player.imageUrl || 'https://placehold.co/150'"
          class="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mask-fade-bottom"
          @error="$event.target.src = 'https://placehold.co/150'"
        />
      </div>

      <div
        class="absolute top-[18%] left-[12%] z-20 flex flex-col items-center leading-none transform translate-z-20"
      >
        <span
          class="font-black text-4xl md:text-5xl text-[#3b2b1a] drop-shadow-sm"
          >{{ overall }}</span
        >
        <span
          class="font-bold text-sm md:text-lg uppercase mt-1 text-[#3b2b1a]"
          >{{ player.position?.substring(0, 3) || "???" }}</span
        >
        <div class="w-8 h-[1px] bg-[#3b2b1a]/40 my-1"></div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
          class="w-6 shadow-sm rounded-sm"
        />
      </div>

      <div
        class="absolute bottom-0 w-full h-[38%] flex flex-col items-center pt-2 z-20 transform translate-z-10"
      >
        <h2
          class="font-black text-xl md:text-2xl uppercase text-[#3b2b1a] truncate max-w-[90%] tracking-tighter drop-shadow-sm"
        >
          {{ player.name }}
        </h2>
        <div class="w-[85%] h-[1px] bg-[#3b2b1a]/20 my-2"></div>

        <div
          class="grid grid-cols-6 gap-1 w-[85%] text-center font-bold text-sm md:text-base text-[#3b2b1a]"
        >
          <div class="stat-col">
            <span>{{ player.pac }}</span
            ><span class="lbl">PAC</span>
          </div>
          <div class="stat-col">
            <span>{{ player.sho }}</span
            ><span class="lbl">SHO</span>
          </div>
          <div class="stat-col">
            <span>{{ player.pas }}</span
            ><span class="lbl">PAS</span>
          </div>
          <div class="stat-col">
            <span>{{ player.dri }}</span
            ><span class="lbl">DRI</span>
          </div>
          <div class="stat-col">
            <span>{{ player.def }}</span
            ><span class="lbl">DEF</span>
          </div>
          <div class="stat-col">
            <span>{{ player.phy }}</span
            ><span class="lbl">PHY</span>
          </div>
        </div>
      </div>

      <div
        v-if="goldTrait"
        class="absolute top-[45%] right-[8%] z-30 animate-bounce-slow transform translate-z-30"
      >
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-b from-[#fffacd] to-[#ffd700] border-2 border-[#b8860b] shadow-[0_0_15px_rgba(255,215,0,0.8)] flex items-center justify-center p-1.5 hover:scale-125 transition-transform"
        >
          <img
            :src="goldTrait.image"
            class="w-full h-full object-contain"
            :title="goldTrait.name"
          />
        </div>
      </div>

      <div
        class="absolute top-[60%] right-[9%] z-20 flex flex-col gap-1.5 transform translate-z-20"
      >
        <div
          v-for="s in silverTraits"
          :key="s.id"
          class="w-6 h-6 rounded-full bg-slate-300 border border-slate-400 shadow-sm flex items-center justify-center p-1 opacity-90 hover:opacity-100 hover:scale-110 transition-all"
        >
          <img
            :src="s.image"
            class="w-full h-full object-contain grayscale"
            :title="s.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.translate-z-10 {
  transform: translateZ(10px);
}
.translate-z-20 {
  transform: translateZ(20px);
}
.translate-z-30 {
  transform: translateZ(30px);
}

.mask-fade-bottom {
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}
.stat-col {
  @apply flex flex-col items-center;
}
.stat-col .lbl {
  @apply text-[0.6rem] font-normal opacity-80;
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
</style>
