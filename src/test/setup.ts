import '@testing-library/jest-dom/vitest';

// index.html trae <meta name="theme-color">; jsdom no lo carga, así que lo
// agregamos acá para que ThemeProvider tenga algo que actualizar.
if (!document.querySelector('meta[name="theme-color"]')) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  document.head.appendChild(meta);
}

// jsdom no implementa matchMedia — lo usa ThemeProvider para 'system'.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
