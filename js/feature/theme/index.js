// Ejercicio Configuracion Theming
const root = document.documentElement;
const temaPalancaBtn = document.getElementById("theme-toggle");
const OPTIONS = {
  black: "Negro",
  white: "Blanco",
};

const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function obtenerTemaActual() {
  return root.getAttribute("data-theme") || OPTIONS.white;
}

function establecerTema(tema) {
  root.setAttribute("data-theme", tema);
  localStorage.setItem("Tema", tema);
  if (temaPalancaBtn) {
    temaPalancaBtn.textContent = `Tema: ${tema}`;
  }
}

export function handleTheme() {
  establecerTema(prefersDarkMode ? OPTIONS.black : OPTIONS.white);
  temaPalancaBtn?.addEventListener("click", () => {
    const actual = obtenerTemaActual();
    establecerTema(actual === OPTIONS.white ? OPTIONS.black : OPTIONS.white);
  });
}
