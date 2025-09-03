
export const Navbar = () => `
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="fas fa-comments fa-2x me-2"></i>ChatApp
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/" data-link>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/login" data-link>Sign in</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register" data-link>Sign up</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;