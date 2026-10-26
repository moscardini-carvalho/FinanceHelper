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


/* Comportamentos do formulário de movimentações */

const botaoNovaMovimentacao = document.querySelector("#nova-movimentacao");
const formularioMovimentacao = document.querySelector("#formulario-movimentacao");
const botaoCancelarMovimentacao = document.querySelector("#cancelar-movimentacao");
const campoData = document.querySelector('#form-movimentacao [name="data"]');

function abrirFormulario() {
    if (!formularioMovimentacao) return;

    formularioMovimentacao.hidden = false;

    if (campoData && !campoData.value) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        campoData.value = `${ano}-${mes}-${dia}`;
    }

    formularioMovimentacao.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function fecharFormulario() {
    if (!formularioMovimentacao) return;

    formularioMovimentacao.hidden = true;
}

if (botaoNovaMovimentacao) {
    botaoNovaMovimentacao.addEventListener("click", abrirFormulario);
}

if (botaoCancelarMovimentacao) {
    botaoCancelarMovimentacao.addEventListener("click", fecharFormulario);
}


/* Cadastro e exibição de movimentações */

const formularioCadastro = document.querySelector("#form-movimentacao");
const mensagemFormulario = document.querySelector("#mensagem-formulario");
const listaMovimentacoes = document.querySelector("#lista-movimentacoes");
const notaDemonstracao = document.querySelector(".demo-note");

const movimentacoes = [];

function formatarValor(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    const [ano, mes, dia] = data.split("-").map(Number);

    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function exibirMovimentacoes() {
    if (!listaMovimentacoes) return;

    listaMovimentacoes.replaceChildren();

    movimentacoes
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .forEach((movimentacao) => {
            const linha = document.createElement("tr");

            const celulaDescricao = document.createElement("td");
            const simbolo = document.createElement("span");
            const titulo = document.createElement("span");

            simbolo.className = `transaction-symbol ${movimentacao.tipo === "receita" ? "salary" : "food"
                }`;
            simbolo.textContent =
                movimentacao.tipo === "receita" ? "↙" : "⌁";

            titulo.className = "transaction-title";
            titulo.textContent = movimentacao.descricao;

            celulaDescricao.append(simbolo, titulo);

            const celulaCategoria = document.createElement("td");
            const categoria = document.createElement("span");
            categoria.className = "category-tag";
            categoria.textContent = movimentacao.categoria;
            celulaCategoria.appendChild(categoria);

            const celulaData = document.createElement("td");
            celulaData.textContent = formatarData(movimentacao.data);

            const celulaForma = document.createElement("td");
            celulaForma.textContent = movimentacao.formaPagamento;

            const celulaValor = document.createElement("td");
            celulaValor.className = movimentacao.tipo === "receita"
                ? "amount positive-text"
                : "amount negative";

            const sinal = movimentacao.tipo === "receita" ? "+" : "−";
            celulaValor.textContent =
                `${sinal} ${formatarValor(movimentacao.valor)}`;

            linha.append(
                celulaDescricao,
                celulaCategoria,
                celulaData,
                celulaForma,
                celulaValor
            );

            listaMovimentacoes.appendChild(linha);
        });

    if (notaDemonstracao) {
        notaDemonstracao.hidden = true;
    }
}

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campos = new FormData(formularioCadastro);

        const dados = {
            descricao: campos.get("descricao"),
            tipo: campos.get("tipo"),
            valor: Number(campos.get("valor")),
            categoria: campos.get("categoria"),
            data: campos.get("data"),
            formaPagamento: campos.get("formaPagamento")
        };

        const resultado = criarMovimentacao(dados);

        if (!resultado.sucesso) {
            mensagemFormulario.textContent = resultado.erros.join(" ");
            return;
        }

        movimentacoes.push(resultado.movimentacao);

        exibirMovimentacoes();

        mensagemFormulario.textContent = "Movimentação cadastrada com sucesso!";

        formularioCadastro.reset();

        if (campoData) {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");

            campoData.value = `${ano}-${mes}-${dia}`;
        }

        formularioMovimentacao.hidden = true;
    });
}

