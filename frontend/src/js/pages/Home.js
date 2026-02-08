import AbstractView from "./AbstractView.js";
import { i18n } from "../i18n/i18n.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Home");
  }

  async init() {
     if(window.location.hash == "#project-info"){
        const element = document.getElementById("project-info");
        if(element){
            element.scrollIntoView({behavior: "smooth"});
            history.replaceState(null, null, window.location.pathname);
        }
     }
  }

  async getHtml() {
    return `
      <div class="home-page">
        <section class="hero-section">
            <div class="hero-bg-accent" style="top: -10%; left: -10%; width: 500px; height: 500px; background: var(--primary-color);"></div>
            <div class="hero-bg-accent" style="bottom: -10%; right: -10%; width: 500px; height: 500px; background: var(--secondary-color);"></div>

            <div class="container position-relative z-1">

                
                <h1 class="hero-title">${i18n.t("home.welcome")}</h1>
                
                <p class="hero-subtitle">
                    ${i18n.t("projectInfo.description")}
                </p>

                <div class="d-flex justify-content-center gap-3 mt-4 animation-delay-400" style="animation: slideUp 0.8s ease-out 0.4s backwards;">
                    <a href="/register" class="btn btn-lg btn-primary px-5 py-3 rounded-pill shadow-lg hover-lift fw-bold">
                        <i class="fas fa-user-plus me-2"></i>${i18n.t("home.signUp")}
                    </a>
                    <a href="/login" class="btn btn-lg btn-white bg-white text-primary border px-5 py-3 rounded-pill shadow-sm hover-lift fw-bold">
                        <i class="fas fa-sign-in-alt me-2"></i>${i18n.t("home.signIn")}
                    </a>
                </div>

                <div class="mt-5 text-muted small">
                   <p class="mb-2"><i class="fas fa-info-circle me-1"></i> ${i18n.t("home.infoMessage")}</p>
                </div>
            </div>
        </section>

        <div class="container pb-5" id="project-info">
            
            <div class="row mb-5">
               <div class="col-12">
                  <div class="card shadow-sm border-0">
                      <div class="card-body p-5">
                          <h2 class="h3 mb-4 border-bottom pb-2">
                              <i class="fas fa-sitemap text-primary me-2"></i>
                              ${i18n.t("projectInfo.architecture.title")}
                          </h2>
                          <p class="text-muted mb-4">${i18n.t("projectInfo.architecture.description")}</p>
                          
                          <div class="architecture-diagram d-flex flex-column align-items-center gap-4 p-4 rounded bg-light" style="border: 1px dashed #cbd5e1;">
                              
                              <div class="diagram-node client px-5 py-3 bg-white shadow-sm rounded">
                                  <i class="fas fa-laptop mb-2 fa-2x"></i>
                                  <div>Frontend (SPA)</div>
                              </div>

                              <div class="text-muted"><i class="fas fa-arrow-down fa-lg"></i></div>

                              <div class="d-flex justify-content-center gap-5">
                                  <div class="diagram-node gateway px-4 py-3 bg-white shadow-sm rounded">
                                      <i class="fas fa-network-wired mb-2"></i>
                                      <div>API Gateway</div>
                                  </div>
                                  <div class="diagram-node service border-primary px-4 py-3 bg-white shadow-sm rounded">
                                      <i class="fas fa-bolt mb-2"></i>
                                      <div>WebSocket Service</div>
                                  </div>
                              </div>

                              <div class="diagram-arrow vertical"><i class="fas fa-arrow-down fa-lg text-muted"></i></div>

                              <div class="p-4 border rounded bg-white shadow-sm position-relative w-100 text-center">
                                  <span class="badge bg-primary px-3 py-2 rounded-pill mb-3">Microservices</span>
                                  <div class="d-flex flex-wrap justify-content-center gap-3">
                                      <div class="diagram-node service"><i class="fas fa-user-shield mb-1"></i> Auth</div>
                                      <div class="diagram-node service"><i class="fas fa-user mb-1"></i> User</div>
                                      <div class="diagram-node service"><i class="fas fa-envelope mb-1"></i> Mail</div>
                                      <div class="diagram-node service"><i class="fas fa-comments mb-1"></i> Chat</div>
                                      <div class="diagram-node service"><i class="fas fa-address-book mb-1"></i> Contacts</div>
                                  </div>
                              </div>

                              <div class="diagram-arrow vertical"><i class="fas fa-arrow-down fa-lg text-muted"></i></div>

                              <div class="d-flex flex-wrap justify-content-center gap-4">
                                  <div class="diagram-node broker bg-white shadow-sm rounded"><i class="fas fa-envelope-open-text mb-1"></i> RabbitMQ</div>
                                  <div class="diagram-node cache bg-white shadow-sm rounded"><i class="fas fa-bolt mb-1"></i> Redis</div>
                                  <div class="diagram-node db bg-white shadow-sm rounded"><i class="fas fa-database mb-1"></i> PostgreSQL</div>
                                  <div class="diagram-node db bg-white shadow-sm rounded"><i class="fas fa-server mb-1"></i> MongoDB</div>
                              </div>

                          </div>
                      </div>
                  </div>
               </div>
            </div>

            <div class="row mb-5">
              <div class="col-12">
                <h2 class="h3 mb-4 text-center border-bottom pb-2">
                    <i class="fas fa-layer-group text-primary me-2"></i>
                    ${i18n.t("projectInfo.techStack.title")}
                </h2>
              </div>
              
              <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm border-0 tech-card hover-lift">
                  <div class="card-body text-center">
                    <div class="icon-wrapper bg-light-primary mb-3 rounded-circle p-3 d-inline-block">
                        <i class="fab fa-java fa-2x text-primary"></i>
                    </div>
                    <h5 class="card-title fw-bold text-primary">${i18n.t("projectInfo.techStack.backend")}</h5>
                    <ul class="list-unstyled text-muted small mt-3">
                      <li class="mb-2">Java 25 (Preview)</li>
                      <li class="mb-2">Spring Boot 3.x</li>
                      <li class="mb-2">Spring Cloud</li>
                      <li>Microservices</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm border-0 tech-card hover-lift">
                  <div class="card-body text-center">
                    <div class="icon-wrapper bg-light-success mb-3 rounded-circle p-3 d-inline-block">
                        <i class="fab fa-js fa-2x text-success"></i>
                    </div>
                    <h5 class="card-title fw-bold text-success">${i18n.t("projectInfo.techStack.frontend")}</h5>
                    <ul class="list-unstyled text-muted small mt-3">
                      <li class="mb-2">Vanilla JavaScript</li>
                      <li class="mb-2">Vite Build Tool</li>
                      <li class="mb-2">Bootstrap 5</li>
                      <li>CSS3 / HTML5</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-3 mb-4">
                 <div class="card h-100 shadow-sm border-0 tech-card hover-lift">
                  <div class="card-body text-center">
                    <div class="icon-wrapper bg-light-warning mb-3 rounded-circle p-3 d-inline-block">
                        <i class="fas fa-database fa-2x text-warning"></i>
                    </div>
                    <h5 class="card-title fw-bold text-warning">${i18n.t("projectInfo.techStack.database")}</h5>
                    <ul class="list-unstyled text-muted small mt-3">
                      <li class="mb-2">PostgreSQL</li>
                      <li class="mb-2">MongoDB</li>
                      <li class="mb-2">Redis (Cache)</li>
                      <li>RabbitMQ</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 col-lg-3 mb-4">
                 <div class="card h-100 shadow-sm border-0 tech-card hover-lift">
                  <div class="card-body text-center">
                    <div class="icon-wrapper bg-light-info mb-3 rounded-circle p-3 d-inline-block">
                        <i class="fas fa-server fa-2x text-info"></i>
                    </div>
                    <h5 class="card-title fw-bold text-info">${i18n.t("projectInfo.techStack.infrastructure")}</h5>
                    <ul class="list-unstyled text-muted small mt-3">
                      <li class="mb-2">Docker & Compose</li>
                      <li class="mb-2">Eureka Discovery</li>
                      <li class="mb-2">Config Server</li>
                      <li>API Gateway</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row mb-5">
                <div class="col-12">
                    <div class="card bg-primary text-white shadow-lg border-0 overflow-hidden rounded-4">
                        <div class="card-body p-5 position-relative">
                            <div class="position-absolute top-0 end-0 opacity-10" style="transform: translate(30%, -30%);">
                                <i class="fas fa-star fa-10x"></i>
                            </div>
                            
                            <h2 class="h3 mb-4 position-relative z-1 border-bottom border-white-50 pb-3">
                                <i class="fas fa-check-circle me-2"></i> ${i18n.t("projectInfo.features.title")}
                            </h2>
                            
                            <div class="row position-relative z-1">
                                <div class="col-md-6">
                                    <h5 class="text-white-50 mb-3 text-uppercase small ls-1">Core & Security</h5>
                                    <ul class="list-group list-group-flush bg-transparent">
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-shield-alt me-2 text-info"></i> ${i18n.t("projectInfo.features.auth")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-lock me-2 text-warning"></i> ${i18n.t("projectInfo.features.e2ee")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-key me-2 text-success"></i> ${i18n.t("projectInfo.features.token")}
                                        </li>
                                         <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-envelope-open-text me-2 text-light"></i> ${i18n.t("projectInfo.features.emailAuth")}
                                        </li>
                                         <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-tachometer-alt me-2 text-danger"></i> ${i18n.t("projectInfo.features.ratelimit")}
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h5 class="text-white-50 mb-3 text-uppercase small ls-1">User Experience</h5>
                                    <ul class="list-group list-group-flush bg-transparent">
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-comment-dots me-2 text-info"></i> ${i18n.t("projectInfo.features.realtime")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-user-plus me-2 text-success"></i> ${i18n.t("projectInfo.features.invite")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-camera me-2 text-warning"></i> ${i18n.t("projectInfo.features.profile")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-mobile-alt me-2 text-light"></i> ${i18n.t("projectInfo.features.responsive")}
                                        </li>
                                        <li class="list-group-item bg-transparent text-white border-white-50 ps-0">
                                            <i class="fas fa-user-secret me-2 text-danger"></i> ${i18n.t("projectInfo.features.privacy")}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    `;
  }
}
