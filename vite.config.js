import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",
  server: {
    port: 3000,
    open: true,
    // headers: {
    //   "Content-Security-Policy": [
    //     "default-src 'self'",
    //     "script-src 'self' https://kit.fontawesome.com https://code.jquery.com https://cdnjs.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.gstatic.com/",
    //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://kit.fontawesome.com https://ka-f.fontawesome.com",
    //     "img-src 'self' data: https: http://res.cloudinary.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    //     "font-src 'self' https://fonts.gstatic.com https://kit.fontawesome.com https://ka-f.fontawesome.com",
    //     "connect-src 'self' http://localhost:8080 ws://localhost:8080 http://localhost:9030 ws://localhost:9030 http://localhost:9040 ws://localhost:9040 https://cdnjs.cloudflare.com https://ka-f.fontawesome.com https://kit.fontawesome.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.gstatic.com/",
    //     "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    //     "media-src 'self'",
    //     "object-src 'none'",
    //     "form-action 'self'",
    //   ].join("; "),
    // },
  },
  build: {
    outDir: "../dist",
  },
});
