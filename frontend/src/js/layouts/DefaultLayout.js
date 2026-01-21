import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export const DefaultLayout = (content) => `

<div class="default-content">
  <div class="overlay-spinner hidden">
      <div class="spinner"></div>
  </div>
  <span class=""></span>
  ${Navbar()}
  <div class="default-content-1" id="default-content-1">
    <div class="page-transition">
      ${content}
    </div>
  </div>
  ${Footer()}
</div>
`;



