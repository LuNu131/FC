<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: String, // 'indigo', 'green', 'purple', 'yellow', 'blue', 'pink'
  description: String,
});

const colorClasses = computed(() => {
  const colors = {
    indigo: {
      from: "indigo-400",
      to: "indigo-600",
      text: "indigo-600",
      light: "indigo-50",
      border: "indigo-200",
    },
    green: {
      from: "green-400",
      to: "green-600",
      text: "green-600",
      light: "green-50",
      border: "green-200",
    },
    purple: {
      from: "purple-400",
      to: "purple-600",
      text: "purple-600",
      light: "purple-50",
      border: "purple-200",
    },
    yellow: {
      from: "yellow-400",
      to: "yellow-600",
      text: "yellow-600",
      light: "yellow-50",
      border: "yellow-200",
    },
    blue: {
      from: "blue-400",
      to: "blue-600",
      text: "blue-600",
      light: "blue-50",
      border: "blue-200",
    },
    pink: {
      from: "pink-400",
      to: "pink-600",
      text: "pink-600",
      light: "pink-50",
      border: "pink-200",
    },
  };

  const selected = colors[props.color] || colors.indigo;

  return {
    wrapper: `border border-${selected.border} hover:border-${selected.border} bg-${selected.light} group-hover:shadow-2xl`,
    iconWrapper: `bg-gradient-to-br from-${selected.from} to-${selected.to}`,
    valueText: `text-${selected.text}`,
  };
});
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl p-6 shadow-xl transition-all duration-300 border-l-8 hover:border-l-[12px] transform hover:translate-y-[-2px] group',
      colorClasses.wrapper,
    ]"
    :style="{
      borderColor: colorClasses.iconWrapper.split('to-')[1]
        ? `var(--tw-gradient-via-color)`
        : '',
    }"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">
        {{ title }}
      </h3>
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg text-white transition-transform group-hover:scale-110',
          colorClasses.iconWrapper,
        ]"
      >
        {{ icon }}
      </div>
    </div>

    <div class="flex items-end justify-between">
      <div :class="['text-4xl font-black', colorClasses.valueText]">
        {{ value }}
      </div>
      <p class="text-sm text-gray-500 font-semibold max-w-[50%] text-right">
        {{ description }}
      </p>
    </div>
  </div>
</template>
