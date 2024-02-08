'use client';

import { Data } from '@/app/api/mal/user/route';
import theme from '@/src/components/theme';
import { User } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import { getUser, saveUser } from '@/src/utils/user';
import { getAxiosError } from '@/src/utils/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MovieIcon from '@mui/icons-material/Movie';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

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

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showAnimeStats, setShowAnimeStats] = useState<boolean>(false);

  const toggleAnimeStats = () => setShowAnimeStats(!showAnimeStats);

  useEffect(() => {
    const cachedUser = getUser();
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    akizukiAxios
      .get(`/api/mal/user`)
      .then((resp) => {
        const data: Data = resp.data;

        const profile: User = {
          username: data.name,
          picture: data.picture,
          gender: data.gender || '',
          birthday: data.birthday || '',
          location: data.location || '',
          joinedAt: data.joined_at || '',
          animeStatistics: {
            numItemsWatching: data.anime_statistics?.num_items_watching || 0,
            numItemsCompleted: data.anime_statistics?.num_items_completed || 0,
            numItemsOnHold: data.anime_statistics?.num_items_on_hold || 0,
            numItemsDropped: data.anime_statistics?.num_items_dropped || 0,
            numItemsPlanToWatch: data.anime_statistics?.num_items_plan_to_watch || 0,
            numItems: data.anime_statistics?.num_items || 0,
            numDaysWatched: data.anime_statistics?.num_days_watched || 0,
            numDaysWatching: data.anime_statistics?.num_days_watching || 0,
            numDaysCompleted: data.anime_statistics?.num_days_completed || 0,
            numDaysOnHold: data.anime_statistics?.num_days_on_hold || 0,
            numDaysDropped: data.anime_statistics?.num_days_dropped || 0,
            numDays: data.anime_statistics?.num_days || 0,
            numEpisodes: data.anime_statistics?.num_episodes || 0,
            numTimesRewatched: data.anime_statistics?.num_times_rewatched || 0,
            meanScore: data.anime_statistics?.mean_score || 0,
          },
          timeZone: data.time_zone || '',
          isSupporter: data.is_supporter || false,
        };

        setUser(profile);
        saveUser(profile);
      })
      .catch((error) => setError(getAxiosError(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error !== '')
    return (
      <Typography color="error" sx={{ textAlign: 'center' }}>
        {error}
      </Typography>
    );

  if (!user)
    return (
      <Typography color="error" sx={{ textAlign: 'center' }}>
        invalid user
      </Typography>
    );

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card>
          <CardMedia component="img" image={user.picture} alt={user.username} />
          <CardContent>
            <Typography variant="h4" textAlign="center" fontWeight="bold" sx={style.link}>
              <Link href={`${MAL_WEB_HOST}/profile/${user.username}`} target="_blank">
                {user.username}{' '}
                {user.isSupporter && (
                  <Tooltip title="MyAnimeList Supporter" arrow>
                    <CheckCircleIcon color="success" />
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
                <Typography textAlign="right">{user.joinedAt.toString().slice(0, 10) || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={style.subtitle}>Timezone</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography textAlign="right">{user.timeZone || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={style.subtitle}>Anime Statistics</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Tooltip title={showAnimeStats ? 'Hide anime stats' : 'Show anime stats'} placement="left" arrow>
                  <IconButton size="small" onClick={toggleAnimeStats}>
                    {showAnimeStats ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Collapse in={showAnimeStats}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Watching</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">
                        {user.animeStatistics.numItemsWatching.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Score</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">{user.animeStatistics?.meanScore.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Completed</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">
                        {user.animeStatistics?.numItemsCompleted.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Total Entries</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">{user.animeStatistics?.numItems.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>On Hold</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">{user.animeStatistics?.numItemsOnHold.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Rewatched</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">
                        {user.animeStatistics?.numTimesRewatched.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Dropped</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">
                        {user.animeStatistics?.numItemsDropped.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Episodes</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">{user.animeStatistics?.numEpisodes.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Plan to Watch</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">
                        {user.animeStatistics?.numItemsPlanToWatch.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={style.subtitle}>Days</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography textAlign="right">{user.animeStatistics?.numDays.toFixed(1)}</Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
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
  );
}

const LoadingSkeleton = () => (
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
                <Fragment key={i}>
                  <Grid item xs={6}>
                    <Typography>
                      <Skeleton />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <Skeleton />
                    </Typography>
                  </Grid>
                </Fragment>
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
);
