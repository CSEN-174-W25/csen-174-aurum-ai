/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            // Add custom theme extensions here
        },
    },
    plugins: [],
}

export default tailwindConfig;