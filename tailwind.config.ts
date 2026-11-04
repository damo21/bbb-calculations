import type { Config } from "tailwindcss";

const config: Config = {
  content: [
     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
     extend: {
       fontFamily: {
         sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
         mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
       },
       colors: {
         ui: {
           background: "#161616",
           "1": "#262626",
           "2": "#393939",
           "3": "#6f6f6f",
           "4": "#f4f4f4",
           "5": "#333333",
         },
         text: {
           "1": "#f4f4f4",
           "2": "#c6c6c6",
           "3": "#6f6f6f",
           "4": "#ffffff",
           "5": "#8d8d8d",
         },
         icon: {
           "1": "#f4f4f4",
           "2": "#c6c6c6",
           "3": "#ffffff",
         },
         error: {
           DEFAULT: "#fa4d56",
           alt: "#da1e28",
         },
         warning: {
           DEFAULT: "#f1c21b",
         },
         success: {
           DEFAULT: "#42be65",
           alt: "#24a148",
         },
         info: {
           DEFAULT: "#4589ff",
           alt: "#0043ce",
         },
         overlay: "#1616161", // use with 70% opacity
         disabled: {
           "1": "#262626",
           "2": "#525252",
           "3": "#8d8d8d",
         },
         hover: {
           DEFAULT: "#4c4c4c",
           alt: "#e5e5e5",
           primary: "#0353e9"
         },
         accent: {
           DEFAULT: "#f1c21b",
           alt: "#fddc69",
         },
         focus: {
           DEFAULT: "#0f62fe",
           alt: "#ffffff",
         },
       },
     },
  },
  plugins: [],
 };
 
export default config;
