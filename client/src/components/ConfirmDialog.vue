<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: "Confirm Action" },
  message: { type: String, default: "Are you sure?" },
  confirmText: { type: String, default: "Confirm" },
  cancelText: { type: String, default: "Cancel" },
  type: { type: String, default: "warning" },
});

const emit = defineEmits(["confirm", "cancel", "close"]);

const colors = {
  warning: {
    bg: "from-yellow-500 to-orange-600",
    icon: "⚠️",
    border: "border-yellow-500/30",
  },
  danger: {
    bg: "from-red-500 to-rose-600",
    icon: "🗑️",
    border: "border-red-500/30",
  },
  info: {
    bg: "from-blue-500 to-indigo-600",
    icon: "ℹ️",
    border: "border-blue-500/30",
  },
};

const currentColor = colors[props.type] || colors.warning;

const handleConfirm = () => {
  emit("confirm");
  emit("close");
};

const handleCancel = () => {
  emit("cancel");
  emit("close");
};
</script>

<template>
  <Transition
    enter-active-class="ease-out duration-300"
    leave-active-class="ease-in duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      @click.self="handleCancel"
    >
      <Transition
        enter-active-class="ease-out duration-300"
        leave-active-class="ease-in duration-200"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="show"
          :class="`relative bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 ${currentColor.border}`"
        >
          <div :class="`h-2 bg-gradient-to-r ${currentColor.bg}`"></div>

          <div class="p-8">
            <div class="flex items-start gap-4 mb-6">
              <div
                :class="`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentColor.bg} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`"
              >
                {{ currentColor.icon }}
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-2xl font-black text-white mb-2">{{ title }}</h3>
                <p class="text-slate-400">{{ message }}</p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="handleCancel"
                class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-95"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                :class="`flex-1 px-6 py-3 bg-gradient-to-r ${currentColor.bg} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95`"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
