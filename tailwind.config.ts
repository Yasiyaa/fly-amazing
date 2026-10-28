import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fly: {
          navy: {
            DEFAULT: "#033F7E",
            50: "#EEF5FC",
            100: "#D6E7FA",
            200: "#ADCFF5",
            300: "#75AFF0",
            400: "#3B8CE9",
            500: "#136DD5",
            600: "#033F7E",
            700: "#023265",
            800: "#02254D",
            900: "#011A37",
            950: "#000E20",
          },
          cyan: {
            DEFAULT: "#01A4A9",
            50: "#E6F8F8",
            100: "#CEF1F2",
            200: "#A3E4E6",
            300: "#6DD2D5",
            400: "#36BEC2",
            500: "#01A4A9",
            600: "#01878B",
            700: "#016A6D",
            800: "#014F51",
            900: "#013536",
          },
          orange: {
            DEFAULT: "#E66017",
            50: "#FEF3EB",
            100: "#FDE4D3",
            200: "#FCC9A7",
            300: "#FAA874",
            400: "#F4823E",
            500: "#E66017",
            600: "#CA4F0F",
            700: "#A43E0F",
            800: "#7F3112",
            900: "#602712",
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
      letterSpacing: {
        widest: ".2em",
        tightest: "-.03em",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2.5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(1, 164, 169, 0.3)" },
          "100%": { boxShadow: "0 0 35px rgba(230, 96, 23, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
