/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom team colors
        "team-green": "#10b981",
        "team-red": "#ef4444",
        "team-yellow": "#f59e0b",
        "team-purple": "#a855f7",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-lg": "0 0 40px rgba(99, 102, 241, 0.4)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.3)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        400: "400ms",
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
    },
  },
  safelist: [
    // Position colors
    { pattern: /text-(red|blue|green|yellow|gray)-(400|500|600|700)/ },
    { pattern: /bg-(red|blue|green|yellow|gray)-(50|100|200|400|500|600)/ },
    { pattern: /border-(red|blue|green|yellow|gray)-(200|300|500)/ },
    { pattern: /from-(red|blue|green|yellow|gray)-(400|500|600)/ },
    { pattern: /to-(red|blue|green|yellow|gray)-(500|600|700)/ },
    // Team colors
    { pattern: /text-team-(green|red|yellow|purple)/ },
    { pattern: /bg-team-(green|red|yellow|purple)/ },
    { pattern: /border-team-(green|red|yellow|purple)/ },
    // Ring colors
    { pattern: /ring-(yellow|gray|orange)-(200|300)/ },
    // Explicit dark mode classes (không dùng pattern với colon)
    "dark:bg-gray-800",
    "dark:bg-gray-900",
    "dark:text-gray-100",
    "dark:text-gray-300",
    "dark:border-gray-700",
  ],
  plugins: [],
};
