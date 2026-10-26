
function validarMovimentacao(dados) {
    const erros = [];

    if (!dados || typeof dados !== "object") {
        return ["Os dados da movimentação são inválidos."];
    }

    if (
        typeof dados.descricao !== "string" ||
        dados.descricao.trim() === ""
    ) {
        erros.push("A descrição é obrigatória.");
    }

    if (!["receita", "despesa"].includes(dados.tipo)) {
        erros.push("O tipo deve ser receita ou despesa.");
    }

    if (
        typeof dados.valor !== "number" ||
        !Number.isFinite(dados.valor) ||
        dados.valor <= 0
    ) {
        erros.push("O valor deve ser um número maior que zero.");
    }

    if (
        typeof dados.categoria !== "string" ||
        dados.categoria.trim() === ""
    ) {
        erros.push("A categoria é obrigatória.");
    }

    if (
        typeof dados.data !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)
    ) {
        erros.push("A data deve estar no formato AAAA-MM-DD.");
    } else {
        const [ano, mes, dia] = dados.data.split("-").map(Number);
        const data = new Date(ano, mes - 1, dia);

        if (
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            erros.push("A data informada não existe.");
        }
    }

    if (
        typeof dados.formaPagamento !== "string" ||
        dados.formaPagamento.trim() === ""
    ) {
        erros.push("A forma de pagamento é obrigatória.");
    }

    return erros;
}

function criarMovimentacao(dados) {
    const erros = validarMovimentacao(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            erros: erros
        };
    }

    const movimentacao = {
        id: gerarId(),
        descricao: dados.descricao.trim(),
        tipo: dados.tipo,
        valor: Math.round((dados.valor + Number.EPSILON) * 100) / 100,
        categoria: dados.categoria.trim(),
        data: dados.data,
        formaPagamento: dados.formaPagamento.trim()
    };

    return {
        sucesso: true,
        movimentacao: movimentacao
    };
}

function gerarId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Permite testar o arquivo com Node.js sem interferir no navegador.
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validarMovimentacao,
        criarMovimentacao
    };
}
