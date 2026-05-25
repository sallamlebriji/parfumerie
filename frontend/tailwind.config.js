/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#111318",
          night: "#07120F",
          pine: "#10231F",
          mist: "#EEF2EF",
          ivory: "#F8F5EF",
          porcelain: "#FFFCF7",
          muted: "#676B73",
          copper: "#A96F3D",
          gold: "#D7B56D"
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
        whatsapp: "#25D366",
        champagne: "#F5EFE6"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(0, 0, 0, 0.08)",
        luxury: "0 25px 70px rgba(0,0,0,0.08)",
        luxuryHover: "0 35px 90px rgba(0,0,0,0.14)"
      },
      fontFamily: {
        display: ['"Manrope"', "sans-serif"],
        title: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"]
      },
      borderRadius: {
        luxury: "28px"
      }
    }
  },
  plugins: []
};
