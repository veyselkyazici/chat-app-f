import { i18n } from "../i18n/i18n.js";
export const Navbar = () => {
  return `
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="fas fa-comments fa-2x me-2"></i>vkychatapp
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/" data-link>${i18n.t(
                          "home.home"
                        )}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#project-info" data-link>${i18n.t(
                          "home.projectInfo"
                        )}</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/login" data-link>${i18n.t(
                          "home.signIn"
                        )}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register" data-link>${i18n.t(
                          "home.signUp"
                        )}</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;
};
