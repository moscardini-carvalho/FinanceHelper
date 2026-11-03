// Configurações de conexão com o Supabase

const SUPABASE_URL = "https://ealvjfymaifldslhwecq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CntOL-WNNxc1vh64f5XgXw_4o8Sl3Bp";

// Inicializa o cliente do Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("FinanceHelper: conexão com Supabase inicializada.");