// Ponto de entrada do Meu Financeiro.
// Nesta issue, o JavaScript cuida apenas de pequenos comportamentos da interface.
// Não há cadastro de movimentações nem armazenamento de dados nesta etapa.

const menuToggle = document.querySelector("#menu-toggle");
const sidebar = document.querySelector("#sidebar");
const mobileOverlay = document.querySelector("#mobile-overlay");
const currentDate = document.querySelector("#current-date");

function atualizarData() {
    if (!currentDate) return;

    const agora = new Date();
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(agora);

    currentDate.textContent = dataFormatada.toLocaleUpperCase("pt-BR");
}

function fecharMenu() {
    if (!sidebar || !menuToggle || !mobileOverlay) return;

    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mobileOverlay.hidden = true;
}

function alternarMenu() {
    if (!sidebar || !menuToggle || !mobileOverlay) return;

    const estaAberto = sidebar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(estaAberto));
    menuToggle.setAttribute("aria-label", estaAberto ? "Fechar menu" : "Abrir menu");
    mobileOverlay.hidden = !estaAberto;
}

if (menuToggle) {
    menuToggle.addEventListener("click", alternarMenu);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener("click", fecharMenu);
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) fecharMenu();
});

atualizarData();
console.info("Meu Financeiro: interface inicial carregada.");
