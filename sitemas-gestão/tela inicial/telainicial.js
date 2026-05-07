// Quando o botão Login for clicado
document.querySelector(".login").addEventListener("click", function () {
    // Troque o link abaixo para a página que você quiser
    window.location.href = "login.html";
});

// Quando o botão Cadastre-se for clicado
document.querySelector(".signup").addEventListener("click", function () {
    // Troque esse link também
    window.location.href = "cadastro.html";
});

// Caso queira transformar o texto "Cadastre-se" em link clicável também:
document.querySelector(".register-text span").addEventListener("click", function () {
    window.location.href = "cadastro.html";
});
