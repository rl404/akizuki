'use client';

import { Data } from '@/app/api/mal/useranime/route';
import AddAnimeButton from '@/src/components/buttons/AddAnimeButton';
import TagEditorButton from '@/src/components/buttons/TagEditorButton';
import UserAnimeCard from '@/src/components/layouts/UserAnimeCard';
import UserAnimeCover from '@/src/components/layouts/UserAnimeCover';
import UserAnimeList from '@/src/components/layouts/UserAnimeList';
import theme from '@/src/components/theme';
import { Layout, User, UserAnime, UserAnimeStatus } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { UserAnimeStatuses } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import { getUser, getUserAnimelist, saveUserAnimelist } from '@/src/utils/user';
import { getAxiosError } from '@/src/utils/utils';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import RenderIfVisible from 'react-render-if-visible';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
  link: {
    'a:hover': {
      color: theme.palette.primary.main,
    },
  },
  tooltipCount: {
    padding: 1,
    paddingLeft: 1.5,
    paddingRight: 1.5,
    background: theme.palette.background.paper,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
  rotateSync: {
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(360deg)',
      },
      '100%': {
        transform: 'rotate(0deg)',
      },
    },
  },
};

export default function Animelist() {
  const [user, setUser] = useState<User>();
  const [userAnimeAll, setUserAnimeAll] = useState<UserAnime[]>([]);
  const [userAnime, setUserAnime] = useState<UserAnime[]>([]);
  const [search, setSearch] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('card');
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSync, setLoadingSync] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setUser(getUser());

    const cached = getUserAnimelist();
    if (cached) {
      setUserAnimeAll(cached);
      setUserAnime(cached);
      setLoading(false);
    }

    callAPI();
  }, []);

  const callAPI = (withLoading = false) => {
    withLoading && setLoading(true);
    withLoading && setLoadingSync(true);

    akizukiAxios
      .get(`/api/mal/useranime`)
      .then((resp) => {
        const data: Data = resp.data;

        const tmp: UserAnime[] = data.data
          .map((a) => ({
            id: a.node.id,
            title: a.node.title,
            picture: a.node.main_picture?.large || a.node.main_picture?.medium || '',
            synonyms: a.node.alternative_titles.synonyms || [],
            enTitle: a.node.alternative_titles.en || '',
            jpTitle: a.node.alternative_titles.ja || '',
            rank: a.node.rank || 0,
            score: a.node.mean || 0,
            popularity: a.node.popularity || 0,
            synopsis: a.node.synopsis || '',
            genres: a.node.genres?.map((g) => g.name) || [],
            status: a.node.status || '',
            nsfw: a.node.nsfw !== 'white',
            episode: a.node.num_episodes || 0,
            mediaType: a.node.media_type || '',
            userStatus: a.node.my_list_status.status || ('' as UserAnimeStatus),
            userScore: a.node.my_list_status.score || 0,
            userEpisode: a.node.my_list_status.num_episodes_watched || 0,
            userStartDate: a.node.my_list_status.start_date || '',
            userEndDate: a.node.my_list_status.finish_date || '',
            tags: a.node.my_list_status.tags || [],
            comments: a.node.my_list_status.comments || '',
          }))
          .sort((a, b) => {
            const i = UserAnimeStatuses.findIndex((x) => x.status === a.userStatus);
            const j = UserAnimeStatuses.findIndex((x) => x.status === b.userStatus);
            if (i === j) return a.title < b.title ? -1 : 1;
            return i - j;
          });

        setUserAnimeAll(tmp);
        setUserAnime(tmp);
        saveUserAnimelist(tmp);
      })
      .catch((error) => setError(getAxiosError(error)))
      .finally(() => {
        setLoading(false);
        setLoadingSync(false);
      });
  };

  const toggleLayout = () => setLayout(layout === 'card' ? 'cover' : layout === 'cover' ? 'list' : 'card');
  const toggleNsfw = () => setNsfw(!nsfw);
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const resetSearch = () => setSearch('');

  useEffect(() => {
    setUserAnime(
      userAnimeAll.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.synonyms.join(',').toLowerCase().includes(search) ||
          a.enTitle.toLowerCase().includes(search) ||
          a.jpTitle.toLowerCase().includes(search),
      ),
    );
  }, [userAnimeAll, search]);

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
    <Grid container spacing={2}>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={12} md>
          <Typography variant="h4" sx={style.link}>
            <Link href={`${MAL_WEB_HOST}/animelist/${user.username}`} target="_blank">
              {`${user.username}'s Animelist `}
            </Link>
            <Tooltip
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: style.tooltipCount,
                },
              }}
              title={
                <Grid container spacing={0.5} sx={{ width: 200 }}>
                  {UserAnimeStatuses.map((s) => (
                    <Fragment key={s.label}>
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>{s.label}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {userAnime.filter((a) => a.userStatus === s.status).length.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Fragment>
                  ))}
                </Grid>
              }
            >
              <Typography display="inline" sx={style.subtitle}>
                — {userAnime.length.toLocaleString()}
              </Typography>
            </Tooltip>
          </Typography>
        </Grid>
        <Grid item container spacing={1} xs={12} sm={12} md="auto">
          <Grid item xs={12} sm>
            <TextField
              label="Search"
              placeholder="anime title..."
              size="small"
              fullWidth
              value={search}
              onChange={onSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="inherit" />
                  </InputAdornment>
                ),
                endAdornment: search !== '' && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={resetSearch}>
                      <ClearIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <Tooltip
              title={layout === 'list' ? 'List Layout' : layout === 'cover' ? 'Cover Layout' : 'Card Layout'}
              placement="top"
              arrow
            >
              <IconButton onClick={toggleLayout}>
                {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
              <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <TagEditorButton type="anime" />
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <AddAnimeButton />
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <Tooltip title={!loadingSync && 'Data not updated? Try re-sync.'} placement="top" arrow>
              <span>
                <IconButton onClick={() => callAPI(true)} disabled={loadingSync}>
                  <SyncIcon sx={loadingSync ? style.rotateSync : {}} />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={layout === 'list' ? 1 : 2}>
        {userAnime.map((a) => {
          switch (layout) {
            case 'card':
              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={a.id}>
                  <RenderIfVisible defaultHeight={200}>
                    <UserAnimeCard userAnime={a} nsfw={nsfw} />
                  </RenderIfVisible>
                </Grid>
              );
            case 'cover':
              return (
                <Grid item xs={6} sm={3} md={2} lg={2} key={a.id}>
                  <RenderIfVisible defaultHeight={200}>
                    <UserAnimeCover userAnime={a} nsfw={nsfw} />
                  </RenderIfVisible>
                </Grid>
              );
            case 'list':
              return (
                <Grid item xs={12} key={a.id}>
                  <RenderIfVisible defaultHeight={40}>
                    <UserAnimeList userAnime={a} />
                  </RenderIfVisible>
                </Grid>
              );
          }
        })}
      </Grid>
    </Grid>
  );
}

const LoadingSkeleton = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h4" gutterBottom>
        <Skeleton variant="rectangular" width={300} sx={{ maxWidth: '100%' }} />
      </Typography>
      <Divider />
    </Grid>
    <Grid item xs={12} sx={{ textAlign: 'center' }}>
      <CircularProgress />
    </Grid>
  </Grid>
);
