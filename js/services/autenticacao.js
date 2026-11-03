
// Realiza o login com e-mail e senha
async function fazerLogin(email, senha) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        console.error("Erro ao realizar login:", error.message);
        return null;
    }

    return data;
}


// Recupera a sessão atual do usuário
async function obterSessao() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Erro ao recuperar sessão:", error.message);
        return null;
    }

    return data.session;
}


// Realiza o logout
async function fazerLogout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Erro ao realizar logout:", error.message);
        return false;
    }

    return true;
}
