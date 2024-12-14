
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatScreenBg: "#8294C4",
        chatBg: '#ACB1D6',
        mesgBg: "#DBDFEA",
        textColor: "#29434E",
        userNameTextColor : "#22177A",
        namebg : "#C5D3E8",



      },
    },
  },
  plugins: [
  ],
  
}