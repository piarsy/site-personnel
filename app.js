// Le contenu et la navigation restent accessibles sans JavaScript.
const menu = document.querySelector(".mobile-menu");

function closeMenu({ restoreFocus = false } = {}) {
  if (!menu?.open) return;
  menu.open = false;
  if (restoreFocus) menu.querySelector("summary").focus();
}

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    const destination = new URL(link.href);
    const samePage = destination.pathname === location.pathname;
    const target = samePage && link.hash ? document.querySelector(link.hash) : null;
    closeMenu();
    // Le lien activé vient d’être masqué : transférer le focus à sa destination.
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu({ restoreFocus: true });
});
document.addEventListener("click", (event) => {
  if (menu?.open && !menu.contains(event.target)) closeMenu();
});
window.matchMedia("(min-width: 720px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

if ("IntersectionObserver" in window) {
  const links = [...document.querySelectorAll(".desktop-nav a")]
    .filter((link) => link.hash && new URL(link.href).pathname === location.pathname);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    }
  }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}
