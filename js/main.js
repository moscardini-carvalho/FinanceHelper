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


function editarMovimentacao(id) {
    const movimentacao = movimentacoes.find(
        (item) => item.id === id
    );

    if (!movimentacao || !formularioCadastro) {
        return;
    }

    movimentacaoEmEdicaoId = movimentacao.id;

    formularioCadastro.elements["descricao"].value =
        movimentacao.descricao;

    formularioCadastro.elements["tipo"].value =
        movimentacao.tipo;

    formularioCadastro.elements["valor"].value =
        movimentacao.valor;

    formularioCadastro.elements["categoria"].value =
        movimentacao.categoria;

    formularioCadastro.elements["data"].value =
        movimentacao.data;

    formularioCadastro.elements["formaPagamento"].value =
        movimentacao.formaPagamento;

    if (mensagemFormulario) {
        mensagemFormulario.textContent =
            "Editando movimentação. Altere os campos e salve.";
    }

    abrirFormulario();
}


function fecharFormulario() {
    if (!formularioMovimentacao) return;

    formularioMovimentacao.hidden = true;
    movimentacaoEmEdicaoId = null;

    if (formularioCadastro) {
        formularioCadastro.reset();
    }

    if (mensagemFormulario) {
        mensagemFormulario.textContent = "";
    }
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

const movimentacoes = carregarMovimentacoes();
let movimentacaoEmEdicaoId = null;

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



            const celulaAcoes = document.createElement("td");

            // Botão Editar
            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.className = "text-button";
            botaoEditar.textContent = "Editar";
            botaoEditar.setAttribute(
                "aria-label",
                `Editar movimentação ${movimentacao.descricao}`
            );

            // Botão Excluir
            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.className = "text-button";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.setAttribute(
                "aria-label",
                `Excluir movimentação ${movimentacao.descricao}`
            );

            botaoEditar.addEventListener("click", () => {
                editarMovimentacao(movimentacao.id);
            });

            botaoExcluir.addEventListener("click", () => {
                excluirMovimentacao(movimentacao.id);
            });

            celulaAcoes.append(botaoEditar, botaoExcluir);


            linha.append(
                celulaDescricao,
                celulaCategoria,
                celulaData,
                celulaForma,
                celulaValor,
                celulaAcoes
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

        let indiceMovimentacao = -1;
        let movimentacaoAnterior = null;

        if (movimentacaoEmEdicaoId !== null) {
            indiceMovimentacao = movimentacoes.findIndex(
                (item) => item.id === movimentacaoEmEdicaoId
            );

            if (indiceMovimentacao === -1) {
                mensagemFormulario.textContent =
                    "Não foi possível encontrar a movimentação para editar.";
                return;
            }

            movimentacaoAnterior = movimentacoes[indiceMovimentacao];

            resultado.movimentacao.id = movimentacaoAnterior.id;

            movimentacoes[indiceMovimentacao] = resultado.movimentacao;
        } else {
            movimentacoes.push(resultado.movimentacao);
        }



        const salvou = salvarMovimentacoes(movimentacoes);

        if (!salvou) {
            if (indiceMovimentacao !== -1) {
                movimentacoes[indiceMovimentacao] = movimentacaoAnterior;
            } else {
                movimentacoes.pop();
            }

            mensagemFormulario.textContent =
                "Não foi possível salvar a movimentação. Tente novamente.";
            return;
        }


        exibirMovimentacoes();
        atualizarResumoFinanceiro();
        atualizarGraficoDespesas();

        mensagemFormulario.textContent = movimentacaoEmEdicaoId !== null
            ? "Movimentação atualizada com sucesso!"
            : "Movimentação cadastrada com sucesso!";


        formularioCadastro.reset();

        movimentacaoEmEdicaoId = null;

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


function atualizarResumoFinanceiro() {
    const elementoSaldo = document.querySelector("#saldo-total");
    const elementoReceitas = document.querySelector("#total-receitas");
    const elementoDespesas = document.querySelector("#total-despesas");
    const elementoQuantidadeReceitas = document.querySelector("#quantidade-receitas");
    const elementoQuantidadeDespesas = document.querySelector("#quantidade-despesas");

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();

    const receitas = movimentacoes.filter((movimentacao) =>
        movimentacao.tipo === "receita"
    );

    const despesas = movimentacoes.filter((movimentacao) =>
        movimentacao.tipo === "despesa"
    );

    const movimentacoesDoMes = movimentacoes.filter((movimentacao) => {
        const [ano, mes] = movimentacao.data.split("-").map(Number);

        return ano === anoAtual && mes === mesAtual + 1;
    });

    const receitasDoMes = movimentacoesDoMes.filter((movimentacao) =>
        movimentacao.tipo === "receita"
    );

    const despesasDoMes = movimentacoesDoMes.filter((movimentacao) =>
        movimentacao.tipo === "despesa"
    );

    const somar = (lista) => lista.reduce(
        (total, movimentacao) => total + movimentacao.valor,
        0
    );

    const saldo = somar(receitas) - somar(despesas);
    const totalReceitas = somar(receitasDoMes);
    const totalDespesas = somar(despesasDoMes);

    if (elementoSaldo) {
        elementoSaldo.textContent = formatarValor(saldo);
    }

    if (elementoReceitas) {
        elementoReceitas.textContent = formatarValor(totalReceitas);
    }

    if (elementoDespesas) {
        elementoDespesas.textContent = formatarValor(totalDespesas);
    }

    if (elementoQuantidadeReceitas) {
        elementoQuantidadeReceitas.textContent =
            `${receitasDoMes.length} ${receitasDoMes.length === 1 ? "entrada" : "entradas"}`;
    }

    if (elementoQuantidadeDespesas) {
        elementoQuantidadeDespesas.textContent =
            `${despesasDoMes.length} ${despesasDoMes.length === 1 ? "movimentação" : "movimentações"}`;
    }
}


function atualizarGraficoDespesas() {
    const grafico = document.querySelector("#grafico-despesas");
    const totalElemento = document.querySelector("#total-grafico-despesas");
    const legenda = document.querySelector("#legenda-despesas");

    if (!grafico || !totalElemento || !legenda) {
        return;
    }

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();

    const despesasDoMes = movimentacoes.filter((movimentacao) => {
        if (movimentacao.tipo !== "despesa") {
            return false;
        }

        const [ano, mes] = movimentacao.data.split("-").map(Number);

        return ano === anoAtual && mes === mesAtual + 1;
    });

    const despesasPorCategoria = {};

    despesasDoMes.forEach((movimentacao) => {
        const categoria = movimentacao.categoria;

        despesasPorCategoria[categoria] =
            (despesasPorCategoria[categoria] || 0) + movimentacao.valor;
    });

    const categorias = Object.entries(despesasPorCategoria)
        .sort((a, b) => b[1] - a[1]);

    const totalDespesas = categorias.reduce(
        (total, [, valor]) => total + valor,
        0
    );

    totalElemento.textContent = formatarValor(totalDespesas);
    legenda.replaceChildren();

    if (totalDespesas === 0) {
        grafico.style.background = "conic-gradient(#252525 0% 100%)";
        grafico.setAttribute(
            "aria-label",
            "Nenhuma despesa registrada neste mês."
        );

        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhuma despesa neste mês.";
        legenda.appendChild(mensagem);

        return;
    }

    const cores = [
        "#1647FF",
        "#8B5CF6",
        "#22C55E",
        "#F59E0B",
        "#EC4899",
        "#06B6D4",
        "#F97316"
    ];

    let percentualAcumulado = 0;

    const segmentos = categorias.map(([categoria, valor], indice) => {
        const percentual = (valor / totalDespesas) * 100;
        const inicio = percentualAcumulado;
        percentualAcumulado += percentual;

        const itemLegenda = document.createElement("div");
        itemLegenda.className = "legend-item";

        const indicador = document.createElement("span");
        indicador.className = "legend-dot";
        indicador.style.backgroundColor = cores[indice % cores.length];

        const nome = document.createElement("span");
        nome.textContent = categoria;

        const valorElemento = document.createElement("strong");
        valorElemento.textContent = formatarValor(valor);

        itemLegenda.append(indicador, nome, valorElemento);
        legenda.appendChild(itemLegenda);

        return `${cores[indice % cores.length]} ${inicio}% ${percentualAcumulado}%`;
    });

    grafico.style.background = `conic-gradient(${segmentos.join(", ")})`;

    grafico.setAttribute(
        "aria-label",
        `Gráfico de despesas por categoria. Total: ${formatarValor(totalDespesas)}.`
    );
}


function excluirMovimentacao(id) {
    const indice = movimentacoes.findIndex(
        (movimentacao) => movimentacao.id === id
    );

    if (indice === -1) {
        return;
    }

    const movimentacaoRemovida = movimentacoes[indice];

    const confirmar = window.confirm(
        `Deseja excluir a movimentação "${movimentacaoRemovida.descricao}"?`
    );

    if (!confirmar) {
        return;
    }

    movimentacoes.splice(indice, 1);

    const salvou = salvarMovimentacoes(movimentacoes);

    if (!salvou) {
        movimentacoes.splice(indice, 0, movimentacaoRemovida);

        alert(
            "Não foi possível excluir a movimentação. Tente novamente."
        );

        return;
    }

    exibirMovimentacoes();
    atualizarResumoFinanceiro();
    atualizarGraficoDespesas();
}


atualizarResumoFinanceiro();
exibirMovimentacoes();
atualizarGraficoDespesas();