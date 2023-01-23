import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import AppBar from '../components/bar/AppBar';
import Head from '../components/head/Head';
import { akizukiAxios } from '../lib/axios';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { theme } from '../components/theme';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Data } from './api/mal/user';
import { getAccessToken, saveUser } from '../lib/storage';
import { WEB_MAL_HOST } from '../lib/myanimelist';
import { randomInt } from '../lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
    userSelect: 'none',
  },
  animeButton: {
    background: `linear-gradient(90deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.light} 100%)`,
    '&:hover': {
      background: `linear-gradient(90deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.dark} 100%)`,
    },
  },
  mangaButton: {
    background: `linear-gradient(90deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.light} 100%)`,
    '&:hover': {
      background: `linear-gradient(90deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.dark} 100%)`,
    },
  },
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
};

export default function Home() {
  const [user, setUser] = React.useState<Data>();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showAnimeStats, setShowAnimeStats] = React.useState<boolean>(false);

  const router = useRouter();

  const toggleAnimeStats = () => {
    setShowAnimeStats((curr) => {
      return !curr;
    });
  };

  React.useEffect(() => {
    if (!router.isReady) return;

    if (!getAccessToken()) {
      router.push('/auth/login');
      return;
    }

    akizukiAxios
      .get(`/api/mal/user`)
      .then((resp) => {
        const data: Data = resp.data;

        setUser({
          id: data.id,
          name: data.name,
          picture: data.picture,
          gender: data.gender,
          birthday: data.birthday,
          location: data.location,
          joined_at: data.joined_at,
          anime_statistics: data.anime_statistics,
          time_zone: data.time_zone,
          is_supporter: data.is_supporter,
        });

        saveUser({ username: data.name, picture: data.picture });
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.message);
          return;
        }
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <LoadingHome />;
  }

  if (error !== '') {
    return error;
  }

  if (!user) {
    return 'empty user';
  }

  return (
    <>
      <Head title="Home" />
      <AppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card>
              <CardMedia component="img" image={user.picture} alt={user.name} />
              <CardContent>
                <Typography variant="h4" textAlign="center" fontWeight="bold" sx={style.link}>
                  <Link href={`${WEB_MAL_HOST}/profile/${user.name}`} target="_blank">
                    {user.name}{' '}
                    {user.is_supporter && (
                      <Tooltip title="myanimelist supporter" arrow>
                        <CheckCircleIcon />
                      </Tooltip>
                    )}
                  </Link>
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Gender</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">{user.gender || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Birthday</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">{user.birthday || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Location</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">{user.location || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Joined</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">{user.joined_at.toString().slice(0, 10) || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Timezone</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">{user.time_zone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={style.subtitle}>Anime Statistics</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Tooltip title={showAnimeStats ? 'hide anime stats' : 'show anime stats'} placement="left" arrow>
                      <IconButton size="small" onClick={toggleAnimeStats}>
                        {showAnimeStats ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  {showAnimeStats && (
                    <>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Watching</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_items_watching.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Score</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">{user.anime_statistics?.mean_score.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Completed</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_items_completed.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Total Entries</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">{user.anime_statistics?.num_items.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>On Hold</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_items_on_hold.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Rewatched</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_times_rewatched.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Dropped</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_items_dropped.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Episodes</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_episodes.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Plan to Watch</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">
                          {user.anime_statistics?.num_items_plan_to_watch.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={style.subtitle}>Days</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography textAlign="right">{user.anime_statistics?.num_days.toFixed(1)}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<MovieIcon />}
                  LinkComponent={Link}
                  href="/animelist"
                  sx={style.animeButton}
                >
                  AnimeList
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<MenuBookIcon />}
                  LinkComponent={Link}
                  href="/mangalist"
                  sx={style.mangaButton}
                >
                  MangaList
                </Button>
              </CardActions>
              <Divider />
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  LinkComponent={Link}
                  href="/auth/logout"
                >
                  Logout
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

const LoadingHome = () => {
  return (
    <>
      <Head title="Home" />
      <AppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Skeleton variant="rectangular" height={400} />
              <CardContent>
                <Typography variant="h4">
                  <Skeleton variant="rectangular" width="40%" sx={{ margin: 'auto' }} />
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    return (
                      <React.Fragment key={i}>
                        <Grid item xs={6}>
                          <Typography>
                            <Skeleton width={50 + randomInt(50)} />
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography>
                            <Skeleton width={50 + randomInt(100)} sx={{ marginLeft: 'auto' }} />
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Skeleton variant="rectangular" height={30} />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton variant="rectangular" height={30} />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardContent>
                <Skeleton variant="rectangular" height={30} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
