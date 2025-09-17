import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#002A4C",
        "brand-ice": "#A8D6E5",
        "brand-sea": "#70A2B8",
        "brand-deep": "#1D4967",
        "brand-steel": "#45728C",
      },
      fontFamily: {
        heading: ['"Sturkopf Grotesk"', '"Manrope"', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
        script: ['"The Youngest Script"', '"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
