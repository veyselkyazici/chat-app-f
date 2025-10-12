import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export const DefaultLayout = (content) => `
<div class="default-content">
<span class=""></span>
  ${Navbar()}
  <div class="default-content-1" id="default-content-1">${content}</div>
  ${Footer()}</div>
`;



