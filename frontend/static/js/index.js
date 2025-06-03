//index.js
import { isAuthenticated } from './view/services/authService.js';
import Home from './view/pages/Home.js';
import Register from './view/pages/Register.js';
import Login from './view/pages/Login.js';
import ForgotPassord from './view/pages/ForgotPassword.js';
import Chat from './view/pages/Chat.js';
import { ChatLayout } from './view/layouts/ChatLayout.js';
import { DefaultLayout } from './view/layouts/DefaultLayout.js';
import { createElement } from './view/utils/util.js'

const routes = [
    { path: '/', view: Home, layout: DefaultLayout },
    { path: '/register', view: Register, layout: DefaultLayout },
    { path: '/login', view: Login, layout: DefaultLayout },
    { path: '/forgot-password', view: ForgotPassord, layout: DefaultLayout },
    { path: '/chat', view: Chat, layout: ChatLayout, authRequired: true },
];

const pathToRegex = (path) => new RegExp(`^${path.replace(/\//g, '\\/')}$`);

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const potentialMatches = routes.map((route) => ({
        route,
        result: location.pathname.match(pathToRegex(route.path)),
    }));

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

    if (!match) {
        match = { route: routes[0], result: [location.pathname] };
    }

    if (match.route.authRequired && !(await isAuthenticated())) {
        return navigateTo('/login');
    }
    const view = new match.route.view();
    // let html;
    // if (match.route.view === Chat) {
    //     if (window.matchMedia('(max-width: 768px)').matches) {
    //         html = await view.getHtmlMobil();
    //         const createMessageBox = createElement('div', 'message-box', { id: "chatWindow" });



    //         const container = document.querySelector('.chat-container');
    //         container.classList.remove('chat-container');
    //         container.classList.add('chat-container-mobile');
    //         container.append(createMessageBox);

    //     } else {
    //         html = await view.getHtml();
    //     }

    // } else {
    //     html = await view.getHtml();
    // }
    
    const html = await view.getHtml();
    const layoutHtml = match.route.layout(html);
    document.querySelector('#app').innerHTML = layoutHtml;


    if (typeof view.init === 'function') {
        await view.init();
    }


    // if (typeof view.addEventListeners === 'function') {
    //     view.addEventListeners();
    // }
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});

export { navigateTo };