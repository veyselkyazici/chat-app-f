//index.js
import { removeHeaderAndFooter } from './view/util.js';
import Home from './view/Home.js';
import Register from './view/Register.js';
import Login from './view/Login.js';
import ForgotPassord from './view/ForgotPassword.js';
import Chat from './view/Chat.js';
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/register", view: Register },
        { path: "/login", view: Login },
        { path: "/forgot-password", view: ForgotPassord },
        { path: "/chat", view: Chat },
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#content").innerHTML = await view.getHtml();
    if (typeof view.addEventListeners === 'function') {
        await view.addEventListeners();
    }

    if (match.route.path === "/chat") {
        removeHeaderAndFooter();
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});

export { navigateTo } ;