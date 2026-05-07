// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    // Recupera o usuário salvo no LocalStorage
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioSalvo) {
      alert("Nenhum usuário cadastrado encontrado.");
      return;
    }

    // Confere se o login está correto
    if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
      // Mensagem de boas-vindas
      const msg = document.createElement("div");
      msg.textContent = `Bem-vindo(a), ${usuarioSalvo.nome}! 🐝`;
      msg.style.background = "#fff";
      msg.style.color = "#333";
      msg.style.padding = "10px 20px";
      msg.style.borderRadius = "10px";
      msg.style.textAlign = "center";
      msg.style.marginTop = "15px";
      msg.style.fontWeight = "bold";
      msg.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
      msg.style.transition = "opacity 0.5s ease";

      form.appendChild(msg);
      form.reset();

      // Some com a mensagem suavemente
      setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 500);
      }, 3000);

    } else {
      alert("E-mail ou senha incorretos!");
    }
  });
});
