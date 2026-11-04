
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
        typeof dados.categoriaId !== "string" ||
        dados.categoriaId.trim() === ""
    ) {
        erros.push("Selecione uma categoria válida.");
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
        categoriaId: dados.categoriaId.trim(),
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
async function salvarMovimentacaoNoBanco(movimentacao) {
    try {
        const sessao = await obterSessao();

        if (!sessao) {
            console.error("Usuário não autenticado.");
            return null;
        }

        const { data, error } = await supabaseClient
            .from("transactions")
            .insert({
                user_id: sessao.user.id,
                category_id: movimentacao.categoriaId,
                description: movimentacao.descricao,
                type: movimentacao.tipo,
                amount: movimentacao.valor,
                date: movimentacao.data,
                payment_method: movimentacao.formaPagamento
            })
            .select()
            .single();

        if (error) {
            console.error("Erro ao salvar movimentação:", error);
            return null;
        }

        return data;

    } catch (erro) {
        console.error("Erro inesperado ao salvar movimentação:", erro);
        return null;
    }
}

async function atualizarMovimentacaoNoBanco(id, movimentacao) {
    try {
        const sessao = await obterSessao();

        if (!sessao) {
            console.error("Usuário não autenticado.");
            return null;
        }
        const { data, error } = await supabaseClient
            .from("transactions")
            .update({
                category_id: movimentacao.categoriaId,
                description: movimentacao.descricao,
                type: movimentacao.tipo,
                amount: movimentacao.valor,
                date: movimentacao.data,
                payment_method: movimentacao.formaPagamento
            })
            .eq("id", id)
            .eq("user_id", sessao.user.id)
            .eq("user_id", (await obterSessao()).user.id)
            .select()
            .single();

        if (error) {
            console.error("Erro ao atualizar movimentação:", error);
            return null;
        }

        return data;

    } catch (erro) {
        console.error("Erro inesperado ao atualizar movimentação:", erro);
        return null;
    }
}

async function excluirMovimentacaoDoBanco(id) {
    try {
        const sessao = await obterSessao();

        if (!sessao) {
            console.error("Usuário não autenticado.");
            return false;
        }

        const { error } = await supabaseClient
            .from("transactions")
            .delete()
            .eq("id", id)
            .eq("user_id", sessao.user.id);

        if (error) {
            console.error("Erro ao excluir movimentação:", error);
            return false;
        }

        return true;

    } catch (erro) {
        console.error("Erro inesperado ao excluir movimentação:", erro);
        return false;
    }
}

async function carregarMovimentacoesDoBanco() {
    try {
        const { data, error } = await supabaseClient
            .from("transactions")
            .select("*, categories(name)")
            .order("date", { ascending: false });

        if (error) {
            console.error("Erro ao carregar movimentações:", error);
            return null;
        }

        return data.map((item) => ({
            id: item.id,
            descricao: item.description,
            tipo: item.type,
            valor: Number(item.amount),
            categoriaId: item.category_id,
            categoria: item.categories?.name || "Categoria não encontrada",
            data: item.date,
            formaPagamento: item.payment_method
        }));

    } catch (erro) {
        console.error("Erro inesperado ao carregar movimentações:", erro);
        return null;
    }
}
// Permite testar o arquivo com Node.js sem interferir no navegador.
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validarMovimentacao,
        criarMovimentacao
    };
}