import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Perfil from "../../public/gravida.png";
import Logo from "../../public/maternalle.png";
import Auth from "../utils/Auth";
import Service from "../utils/Service";
import clienteMenu from "../menu/cliente";
import adminMenu from "../menu/admin";

const service = new Service();
const auth = new Auth();

const Header = () => {

    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState([]);
    const [userId, setUserId] = useState(auth.getId())

    const navigate = useNavigate();

    const handleClick = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        service.logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!auth.isAuthenticated() || !userId) {
            // Se não estiver autenticado, define um menu padrão ou sai.
            setMenu(clienteMenu.menu); 
            return;
        }

        const fetchUserRole = async () => {
            try {
                const response = await service.get('/usuario', userId); 
                
                const role = response.data?.role;
                
                switch (role) {
                    case 'admin':
                        setMenu(adminMenu.menu);
                        break;
                    case 'cliente':
                        setMenu(clienteMenu.menu);
                        break;
                    default:
                        setMenu(clienteMenu.menu);
                        break;
                }
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário:", error);
                setMenu(clienteMenu.menu);
            }
        };

        fetchUserRole();
        
    }, [userId]);

  return (
    <header className="bg-brand-50/10 backdrop-blur border-b border-brand-100 sticky top-0 z-50">
        <nav className="max-w mx-auto flex items-center justify-between px-10 py-1">
            <div className="flex gap-6">
                <button className="cursor-pointer">
                    ☰
                </button>
                <Link to={`${userId ? '/dasboard' : '/'}`} className="flex items-center">
                    <img 
                        src={Logo} 
                        alt="Perfil" 
                        className="h-10 w-30 cursor-pointer"
                    />
                </Link>
            </div>

            <div className="relative flex items-center gap-3">
                {userId ? (
                    <ListItemButton 
                        onClick={handleClick}
                        className="p-0 min-w-0" // Remove padding e largura mínima do MUI
                        style={{ padding: 0, minWidth: 0, width: 'auto' }} 
                    >
                        <img 
                            src={Perfil} 
                            alt="Perfil" 
                            className="h-10 w-10 rounded-full border border-brand-300 cursor-pointer"
                        />
                    </ListItemButton>
                ) : (
                    // Exibe o botão Entrar se não estiver autenticado
                    <a href="/login"
                        className="hidden md:inline-block px-4 py-2 rounded-full bg-brand-500 text-white hover:bg-brand-600">
                        Entrar
                    </a>
                )}
                {userId && (
                    <Collapse 
                        in={open} 
                        timeout="auto" 
                        unmountOnExit 
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                    >
                        <List component="div" disablePadding> 
                            <ListItemButton 
                                onClick={handleLogout}
                                className="hover:bg-gray-100"
                            >
                                <ListItemText primary="Sair" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                )}
            </div>
        </nav>

        <div id="mobileMenu" className="md:hidden hidden border-t border-brand-100">
            <div className="max-w-6xl mx-auto p-4 flex flex-col gap-3">
                <a className="hover:text-brand-700" href="#">Início</a>
                <a className="hover:text-brand-700" href="#">Conteúdos</a>
                <a className="hover:text-brand-700" href="#">Consultas</a>
                <a className="hover:text-brand-700" href="#">Comunidade</a>
                <a href="#login" className="px-4 py-2 rounded-full bg-brand-500 text-white text-center hover:bg-brand-600">
                    Entrar
                </a>
            </div>
        </div>
    </header>
  );
};

export default Header;