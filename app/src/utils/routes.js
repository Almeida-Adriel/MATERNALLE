import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Conteudos from "../pages/Conteudos";

const routes = [
    {path: '/home', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/cadastro', name: 'Cadastro', component: Cadastro},
    {path: '/conteudos', name: 'Material de Apoio', component: Conteudos},
]

export default routes;