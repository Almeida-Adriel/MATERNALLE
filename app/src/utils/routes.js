import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import Login from "../pages/Login";
import esqueciMinhaSenha from "../pages/esqueciMinhaSenha";
import Conteudos from "../pages/Conteudos";
import Dashboard from "../pages/Dashboard";
import Central from "../pages/Central";

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/cadastro', name: 'Cadastro', component: Cadastro},
    {path: '/esqueci-minha-senha', name: 'Esqueci Minha Senha', component: esqueciMinhaSenha},
    {path: '/dashboard', name: 'Dashboard Financeiro', component: Dashboard},
    {path: '/conteudos', name: 'Material de Apoio', component: Conteudos},
    {path: '/central', name: 'Central', component: Central},
]

export default routes;