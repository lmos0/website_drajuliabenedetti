export function initMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

export function initAdminMenuToggle() {
  const adminMenuToggle = document.querySelector(".admin-menu-toggle");
  const adminMobileMenu = document.getElementById("admin-mobile-menu");

  if (!adminMenuToggle || !adminMobileMenu) return;

  adminMenuToggle.addEventListener("click", () => {
    const isOpen = adminMobileMenu.classList.toggle("open");
    adminMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  adminMobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      adminMobileMenu.classList.remove("open");
      adminMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
