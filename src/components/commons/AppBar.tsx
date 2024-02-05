'use client';

import theme from '@/src/components/theme';
import { User } from '@/src/types';
import { getUser } from '@/src/utils/user';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MovieIcon from '@mui/icons-material/Movie';
import Person2Icon from '@mui/icons-material/Person2';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AkizukiAppBar() {
  const [user, setUser] = useState<User>();
  const [userAnchor, setUserAnchor] = useState<HTMLElement | null>();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => setUserAnchor(event.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  return (
    <AppBar
      position="static"
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, userSelect: 'none', fontWeight: 'bold' }}>
          Akizuki
        </Typography>
        <Box sx={{ flexGrow: 0, marginRight: 2 }}>
          <Link href="https://github.com/rl404/akizuki" color={theme.palette.common.white} target="_blank">
            <IconButton>
              <GitHubIcon />
            </IconButton>
          </Link>
        </Box>
        {user && (
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
              <Avatar alt={user.username} src={user.picture} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={closeUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Link href="/">
                <MenuItem>
                  <ListItemIcon>
                    <Person2Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
              </Link>
              <Link href="/animelist">
                <MenuItem>
                  <ListItemIcon>
                    <MovieIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Animelist</ListItemText>
                </MenuItem>
              </Link>
              <Link href="/mangalist">
                <MenuItem>
                  <ListItemIcon>
                    <MenuBookIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Mangalist</ListItemText>
                </MenuItem>
              </Link>
              <Link href="/auth/logout">
                <MenuItem>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
