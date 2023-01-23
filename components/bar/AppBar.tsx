import * as React from 'react';
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
import Person2Icon from '@mui/icons-material/Person2';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GitHubIcon from '@mui/icons-material/GitHub';
import { User } from '../../type/Types';
import { getUser } from '../../lib/storage';
import { theme } from '../theme';
import Link from 'next/link';

const AkizukiAppBar = React.memo(({ title = 'Akizuki' }: { title?: string }) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, userSelect: 'none' }}>
          <b>{title}</b>
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
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={user.username} src={user.picture} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
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
});

export default AkizukiAppBar;
