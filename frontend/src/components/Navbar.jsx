import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Chip,
  IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const NAV_LINKS = [
  { label: 'Accueil', to: '/', hash: '' },
  { label: 'Problématique', to: '/', hash: '#problem' },
  { label: 'Solution', to: '/', hash: '#solution' },
  { label: 'Objectifs', to: '/', hash: '#objectives' },
];

export default function Navbar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDemo = location.pathname === '/demo';

  const scrollTo = (hash) => {
    if (!hash) return;
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(5, 13, 26, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,188,212,0.15)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <MonitorHeartIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', flexGrow: 0, mr: 4, letterSpacing: 1 }}
          >
            SafeOp AI
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {NAV_LINKS.map(link => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.to}
                  onClick={() => scrollTo(link.hash)}
                  sx={{
                    color: isDemo ? 'text.secondary' : 'text.primary',
                    '&:hover': { color: 'primary.main' },
                    fontSize: '0.875rem',
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0, display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
            <Chip
              label="ESPRIM 2026"
              size="small"
              sx={{ color: 'primary.main', borderColor: 'primary.main', display: { xs: 'none', sm: 'flex' } }}
              variant="outlined"
            />
            <Button
              component={Link}
              to="/demo"
              variant="contained"
              startIcon={<SmartToyIcon />}
              size="small"
              sx={{ ml: 1 }}
            >
              Démo Live
            </Button>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 220, pt: 2 }}>
          {NAV_LINKS.map(link => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                component={Link}
                to={link.to}
                onClick={() => { scrollTo(link.hash); setDrawerOpen(false); }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/demo" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Démo Live" primaryTypographyProps={{ color: 'primary.main', fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
