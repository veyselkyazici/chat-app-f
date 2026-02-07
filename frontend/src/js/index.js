//index.js
import { authService } from "./services/authService.js";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import ForgotPassord from "./pages/ForgotPassword.js";
import Chat from "./pages/Chat.js";
import VerificationSuccess from "./pages/VerificationSuccess.js";
import VerificationFailed from "./pages/VerificationFailed.js";
import { ChatLayout } from "./layouts/ChatLayout.js";
import { DefaultLayout } from "./layouts/DefaultLayout.js";
import Verify from "./pages/Verify.js";


let currentView = null;
const routes = [
  { path: "/", view: Home, layout: DefaultLayout },

  { path: "/register", view: Register, layout: DefaultLayout },
  { path: "/login", view: Login, layout: DefaultLayout },
  { path: "/forgot-password", view: ForgotPassord, layout: DefaultLayout },
  { path: "/chat", view: Chat, layout: ChatLayout, authRequired: true },

  {
    path: "/verification-success",
    view: VerificationSuccess,
    layout: DefaultLayout,
    guard: () => {
      return sessionStorage.getItem("verified") === "true";
    },
  },
  {
    path: "/verification-failed",
    view: VerificationFailed,
    layout: DefaultLayout,
    guard: () => {
      return sessionStorage.getItem("verificationFailed") === "true";
    },
  },

  { path: "/verify", view: Verify, layout: DefaultLayout },
];

const pathToRegex = (path) => new RegExp(`^${path.replace(/\//g, "\\/")}$`);

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  if (currentView?.destroy) {
    currentView.destroy();
  }
  const potentialMatches = routes.map((route) => ({
    route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null,
  );

  if (!match) {
    match = { route: routes[0], result: [location.pathname] };
  }

  if (match.route.authRequired && !(await authService.isAuthenticated())) {
    return navigateTo("/login");
  }

  if (match.route.guard && !match.route.guard()) {
    return navigateTo("/");
  }

  const view = new match.route.view();
  currentView = view;
  const html = await view.getHtml();
  const layoutHtml = match.route.layout(html);
  document.querySelector("#app").innerHTML = layoutHtml;

  if (typeof view.init === "function") {
    await view.init();
  }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});

export { navigateTo };
