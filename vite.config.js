import { defineConfig } from "vite";

export default defineConfig({
  base: "/Binks-Melody/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        home: "home.html",
        playlists: "playlists.html",
        playlist: "playlist.html",
        signup: "signup.html",
      },
    },
  },
});
