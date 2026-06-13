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
        maroon: "#1E3A8A",   // deep indigo-navy (footer, dark sections)
        spice: "#2563EB",    // royal blue (buttons, active states)
        saffron: "#E08A1E",  // gold (highlights, star, search button)
        turmeric: "#F4B942", // amber (badges, accents)
        cream: "#FFFFFF",    // pure white (page background)
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
