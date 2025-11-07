import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Perfil from "../../public/logo.png";
import Logo from "../../public/maternalle.png";
import Auth from "../utils/service/Auth";
import Service from "../utils/service/Service";
import { MdLogout } from "react-icons/md";


const service = new Service();
const auth = new Auth();

const Header = ({ toggleSidebar }) => {

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(auth.getId())

    const navigate = useNavigate();

    const handleClick = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        service.logout();
        navigate('/login');
    };

  return (
    <header className="bg-brand-50/10 backdrop-blur border-b border-brand-100 sticky top-0 z-50">
        <nav className="max-w mx-auto flex items-center justify-between px-10 py-1">
            <div className="flex gap-6">
                {auth.isAuthenticated() && (
                    <button className="cursor-pointer" style={{color: "#78173d"}} onClick={toggleSidebar}>
                        ☰
                    </button>
                )}
                <Link to={`${userId ? '/central' : '/'}`} className="flex items-center">
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
                        className="p-0 min-w-0"
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
                                onClick={() => navigate("/perfil")}
                                className="hover:bg-gray-100"
                            >
                                <ListItemText primary="Perfil" />
                            </ListItemButton>
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
    </header>
  );
};

export default Header;