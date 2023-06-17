/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Proxima Nova", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                "primary-blue": "hsl(168, 67%, 63%)",
                "primary-white": "hsl(165,  14%, 87%)",
                "hover-blue": "hsl(168, 96%, 40%)",
                "aside-blue": "hsl(168, 49%, 87%)",
                "aside-bluedark": "hsl(168, 49%, 68%)"
            },
        },
    },
    plugins: [],
};
