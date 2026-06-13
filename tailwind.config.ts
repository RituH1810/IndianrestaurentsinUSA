import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#1B3A6B",   // deep navy (was dark red)
        spice: "#2563EB",    // royal blue (was spice red)
        saffron: "#E08A1E",  // gold — unchanged, pops on navy
        turmeric: "#F4B942", // amber — unchanged, accent
        cream: "#EFF6FF",    // light sky blue (was warm cream)
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
