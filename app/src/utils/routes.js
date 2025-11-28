import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import Login from "../pages/Login";
import esqueciMinhaSenha from "../pages/esqueciMinhaSenha";
import Conteudos from "../pages/Conteudos";
import ConteudosAdm from "../pages/adm/ConteudosAdm";
import Dashboard from "../pages/Dashboard";
import Central from "../pages/Central";
import Notas from "../pages/Notas";
import AcessoNegado from "../pages/Error/AcessoNegado";
import Usuarios from "../pages/adm/Usuarios"
import ConteudoId from "../pages/ConteudosList";

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/cadastro', name: 'Cadastro', component: Cadastro},
    {path: '/esqueci-minha-senha', name: 'Esqueci Minha Senha', component: esqueciMinhaSenha},
    {path: '/acesso_negado', name: 'Acesso Negado', component: AcessoNegado},
    {path: '/dashboard', name: 'Dashboard Financeiro', component: Dashboard},
    {path: '/conteudos_adm', name: 'Material de Apoio', component: ConteudosAdm},
    {path: '/usuarios', name: 'Usuários', component: Usuarios},
    {path: '/central', name: 'Central', component: Central},
    {path: '/notas', name: 'Notas', component: Notas},
    {path: '/conteudos', name: 'Listagem de Material de Apoio', component: Conteudos},
    {path: '/conteudos/:id', name: 'Material de Apoio', component: ConteudoId},
]

export default routes;