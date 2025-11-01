import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material/styles";
import { Box, IconButton, Toolbar } from '@mui/material'; 
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import CloseIcon from '@mui/icons-material/Close';
import { 
    MdDashboard, 
    MdAttachMoney, 
    MdNoteAlt, 
    MdAutoStories, 
    MdHealthAndSafety 
} from 'react-icons/md';
import customTheme from "../utils/CustomTheme"
import Logo from "../../public/maternalle.png";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary.light ||'inherit', // Cor do texto padrão
    '&.active .MuiListItemButton-root': {
        backgroundColor: theme.palette.primary.medium, // Cor de fundo para o item ativo
        color: theme.palette.primary.contrastText, // Cor do texto para o item ativo
    },
    '&.active .MuiListItemText-primary': {
        fontWeight: 'bold', 
    },
}));

const iconMap = {
    MdDashboard: MdDashboard,
    MdAttachMoney: MdAttachMoney,
    MdNoteAlt: MdNoteAlt,
    MdAutoStories: MdAutoStories,
    MdHealthAndSafety: MdHealthAndSafety,
};

const NavItem = ({ item }) => {
    const [open, setOpen] = useState(false);

    const IconComponent = item.icon ? iconMap[item.icon] : null;

    const handleClick = () => {
        setOpen(!open);
    };

    if (item.children) {
        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleClick}>
                        {IconComponent && (
                            <ListItemIcon>
                                <IconComponent size={20} />
                            </ListItemIcon>
                        )}
                        <ListItemText primary={item.name} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4 }}>
                        {item.children.map((child, index) => (
                            <NavItem key={index} item={child} />
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <StyledNavLink to={item.url} end={item.url === '/dashboard'}>
            <ListItem disablePadding>
                <ListItemButton>
                    {IconComponent && (
                        <ListItemIcon>
                            <IconComponent size={20} />
                        </ListItemIcon>
                    )}
                    <ListItemText primary={item.name} />
                </ListItemButton>
            </ListItem>
        </StyledNavLink>
    );
};

const DefaultSidebar = ({ sidebarVisible, toggleSidebar, menu }) => {
    return (
        <ThemeProvider theme={customTheme}>
            <Drawer
                variant={"temporary"}
                anchor="left"
                open={sidebarVisible}
                onClose={toggleSidebar}
                PaperProps={{
                    sx: { 
                        width: 270, 
                        position: 'sticky', 
                        backgroundColor: `linear-gradient(to bottom, ${customTheme.palette.primary.light}, ${customTheme.palette.primary.main})`,
                    }
                }}
            >
                <Toolbar 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        minHeight: '64px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Box 
                        component="img"
                        src={Logo}
                        alt="Logo"
                        sx={{ height: 42, width: 'auto', marginLeft: -2 }}
                    />
                    
                    <IconButton 
                        onClick={toggleSidebar}
                        aria-label="close"
                        size="large"
                        sx={{ marginRight: -2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <List component="nav">
                    {menu.map((item, index) => (
                        <NavItem key={index} item={item} />
                    ))}
                </List>
            </Drawer>
        </ThemeProvider>
    );
};

export default DefaultSidebar;