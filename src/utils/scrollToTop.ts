/** Sube el scroll de la ventana y del contenedor principal de oficina. */
export const scrollAppToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const main = document.getElementById('yk-main-scroll');
  if (main) {
    main.scrollTop = 0;
  }
};
