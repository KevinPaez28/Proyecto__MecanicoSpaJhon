import './style.css';
import { router } from './router/router'



const main = document.querySelector('#app');

window.addEventListener('hashchange', () => {
  router(main);
});

window.addEventListener('DOMContentLoaded', () => {
  router(main);
});