//index.js
import { authService } from "./view/services/authService.js";
import Home from "./view/pages/Home.js";
import Register from "./view/pages/Register.js";
import Login from "./view/pages/Login.js";
import ForgotPassord from "./view/pages/ForgotPassword.js";
import Chat from "./view/pages/Chat.js";
import VerificationSuccess from "./view/pages/VerificationSuccess.js";
import VerificationFailed from "./view/pages/VerificationFailed.js";
import { ChatLayout } from "./view/layouts/ChatLayout.js";
import { DefaultLayout } from "./view/layouts/DefaultLayout.js";
import Verify from "./view/pages/Verify.js";

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
  },
  {
    path: "/verification-failed",
    view: VerificationFailed,
    layout: DefaultLayout,
  },

  { path: "/verify", view: Verify, layout: DefaultLayout },
];

const pathToRegex = (path) => new RegExp(`^${path.replace(/\//g, "\\/")}$`);

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const potentialMatches = routes.map((route) => ({
    route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = { route: routes[0], result: [location.pathname] };
  }

  if (match.route.authRequired && !(await authService.isAuthenticated())) {
    return navigateTo("/login");
  }
  const view = new match.route.view();

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
