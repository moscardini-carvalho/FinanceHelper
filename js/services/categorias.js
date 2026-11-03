async function carregarCategorias() {
    try {
        const { data, error } = await supabaseClient
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("name");

        if (error) {
            console.error("Erro ao carregar categorias:", error);
            return [];
        }

        return data;

    } catch (erro) {
        console.error("Erro inesperado ao carregar categorias:", erro);
        return [];
    }
}

async function cadastrarCategoria(nome) {
    try {
        const sessao = await obterSessao();

        if (!sessao) {
            console.error("Usuário não autenticado.");
            return null;
        }

        const { data, error } = await supabaseClient
            .from("categories")
            .insert({
                user_id: sessao.user.id,
                name: nome.trim(),
                is_active: true
            })
            .select()
            .single();

        if (error) {
            console.error("Erro ao cadastrar categoria:", error);
            return null;
        }

        return data;

    } catch (erro) {
        console.error("Erro inesperado:", erro);
        return null;
    }
}

async function preencherSelectCategorias() {
    const campoCategoria = document.querySelector("#categoria-movimentacao");

    if (!campoCategoria) return;

    campoCategoria.innerHTML = `
        <option value="">Selecione uma categoria</option>
    `;

    const categorias = await carregarCategorias();

    categorias.forEach((categoria) => {
        const opcao = document.createElement("option");

        opcao.value = categoria.id;
        opcao.textContent = categoria.name;

        campoCategoria.appendChild(opcao);
    });
}