import { publicApi } from "../services/api.js";

const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginStatus = document.getElementById("admin-login-status");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = adminLoginForm.querySelector("#admin-email")?.value.trim() || "";
    const password = adminLoginForm.querySelector("#admin-password")?.value || "";

    if (!email || !password) {
      if (adminLoginStatus) {
        adminLoginStatus.textContent = "Preencha todos os campos.";
      }
      return;
    }

    if (adminLoginStatus) {
      adminLoginStatus.textContent = "Autenticando...";
    }

    try {
      const data = await publicApi("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      if (adminLoginStatus) {
        adminLoginStatus.textContent = "Redirecionando...";
      }

      window.location.href = adminLoginForm.dataset.redirect || "agenda.html";
    } catch {
      if (adminLoginStatus) {
        adminLoginStatus.textContent = "E-mail ou senha inválidos.";
      }
    }
  });
}
