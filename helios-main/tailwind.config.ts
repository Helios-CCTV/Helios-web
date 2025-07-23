import type { Config } from 'tailwindcss'

const config: Config = {
  content: ["./index.html", "src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gray-custom': '#868686',
      },
    },  
  },
  plugins: [],
}
export default config