import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from "@mui/material/styles";
import customTheme from "../utils/CustomTheme"

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary.light ||'inherit', // Cor do texto padrão
    '&.active .MuiListItemButton-root': {
        backgroundColor: theme.palette.primary.main, // Cor de fundo para o item ativo
        color: theme.palette.primary.contrastText, // Cor do texto para o item ativo
    },
    '&.active .MuiListItemText-primary': {
        fontWeight: 'bold', 
    },
}));

const NavItem = ({ item }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    if (item.children) {
        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleClick}>
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
                        backgroundColor: customTheme.palette.primary.light
                    }
                }}
            >
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