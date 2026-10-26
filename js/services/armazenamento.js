
const CHAVE_MOVIMENTACOES = "financeHelper_movimentacoes";

function salvarMovimentacoes(movimentacoes) {
    try {
        localStorage.setItem(
            CHAVE_MOVIMENTACOES,
            JSON.stringify(movimentacoes)
        );

        return true;
    } catch (erro) {
        console.error("Erro ao salvar movimentações:", erro);
        return false;
    }
}

function carregarMovimentacoes() {
    try {
        const dados = localStorage.getItem(CHAVE_MOVIMENTACOES);

        if (!dados) {
            return [];
        }

        const movimentacoes = JSON.parse(dados);

        if (!Array.isArray(movimentacoes)) {
            return [];
        }

        return movimentacoes;
    } catch (erro) {
        console.error("Erro ao carregar movimentações:", erro);
        return [];
    }
}
