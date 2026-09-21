/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#15130F",
          night: "#08130F",
          pine: "#0F2620",
          moss: "#1B3A31",
          mist: "#ECEFE9",
          ivory: "#F6F1E7",
          porcelain: "#FFFCF6",
          sand: "#E9DFCB",
          muted: "#6B6A63",
          copper: "#9C5F33",
          gold: "#C9A45C",
          goldsoft: "#E6D2A0",
          golddeep: "#7F5F25",
          wine: "#7A2633"
        },
        luxuryBlack: "#0B0B0B",
        softBlack: "#151515",
        luxuryGold: "#C9A227",
        lightGold: "#E6C766",
        luxuryBeige: "#F5EFE6",
        elegantGray: "#8A8A8A",
        ink: "#0B0B0B",
        softblack: "#151515",
        gold: "#C9A227",
        lightgold: "#E6C766",
        beige: "#F5EFE6",
        ivory: "#FAF7F0",
        elegantgray: "#8A8A8A",
        whatsapp: "#1FA855",
        champagne: "#F5EFE6"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(0, 0, 0, 0.08)",
        luxury: "0 25px 70px rgba(0,0,0,0.08)",
        luxuryHover: "0 35px 90px rgba(0,0,0,0.14)",
        lift: "0 1px 0 rgba(21,19,15,0.04), 0 18px 40px -18px rgba(21,19,15,0.28)"
      },
      fontFamily: {
        display: ['"Bodoni Moda"', '"Amiri"', "Georgia", "serif"],
        title: ['"Bodoni Moda"', '"Amiri"', "Georgia", "serif"],
        body: ['"Manrope"', '"Tajawal"', "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-2xl": ["clamp(3rem, 7.4vw, 6.25rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(2.5rem, 5.4vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 3.9vw, 3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.5rem, 2.5vw, 2.125rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }]
      },
      borderRadius: {
        luxury: "28px"
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};
