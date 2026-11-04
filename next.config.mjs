/** @type {import('next').NextConfig} */
const nextConfig = {
  // the app is client-side only (localStorage), so ship it as plain static files
  output: "export",
  // Netlify was set up for the old Create React App build folder
  distDir: "build",
};

export default nextConfig;
