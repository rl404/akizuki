import {
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import AppBar from '../components/bar/AppBar';
import UserAnimeCard from '../components/card/UserAnimeCard';
import Head from '../components/head/Head';
import { akizukiAxios } from '../lib/axios';
import { getUser, getUserAnimelist, saveUserAnimelist } from '../lib/storage';
import { User, UserAnime } from '../type/Types';
import { Data } from './api/mal/animelist';
import SyncIcon from '@mui/icons-material/Sync';
import RenderIfVisible from 'react-render-if-visible';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import UserAnimeList from '../components/list/UserAnimeList';
import { theme } from '../components/theme';
import TagEditorButton from '../components/button/TagEditorButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const statusOrder = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
};

export default function Animelist() {
  const router = useRouter();

  const [user, setUser] = React.useState<User>({ username: '', picture: '' });
  const [list, setList] = React.useState<Array<UserAnime>>([]);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);

  const [layout, setLayout] = React.useState<string>('grid');

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const callAPI = (withLoading: boolean = false) => {
    withLoading && setLoading(true);

    akizukiAxios
      .get(`/api/mal/animelist`)
      .then((resp) => {
        const data: Data = resp.data;

        const tmp: Array<UserAnime> = data
          .map<UserAnime>((a) => {
            return {
              id: a.node.id,
              title: a.node.title,
              picture: a.node.main_picture?.large || a.node.main_picture?.medium || '',
              rank: a.node.rank || 0,
              score: a.node.mean || 0,
              popularity: a.node.popularity || 0,
              synopsis: a.node.synopsis || '',
              genres: a.node.genres?.map((g) => g.name) || [],
              status: a.node.status || '',
              episode: a.node.num_episodes || 0,
              mediaType: a.node.media_type || '',
              userStatus: a.list_status.status || '',
              userScore: a.list_status.score || 0,
              userEpisode: a.list_status.num_episodes_watched || 0,
              userStartDate: a.list_status.start_date || '',
              userEndDate: a.list_status.finish_date || '',
              tags: a.list_status.tags || [],
              comments: a.list_status.comments || '',
            };
          })
          .sort((a: UserAnime, b: UserAnime): number => {
            const i = statusOrder.indexOf(a.userStatus);
            const j = statusOrder.indexOf(b.userStatus);

            if (i === j) {
              return a.title < b.title ? -1 : 1;
            }

            return i - j;
          });

        setList(tmp);
        saveUserAnimelist(tmp);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.message);
          return;
        }
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    if (!router.isReady) return;

    const u = getUser();
    if (!u) {
      router.push('/auth/login');
      return;
    }

    setUser(u);

    const cached = getUserAnimelist();
    if (cached) {
      setList(cached);
      setLoading(false);
    }

    callAPI();
  }, [router]);

  const [search, setSearch] = React.useState<string>('');

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const resetSearch = () => {
    setSearch('');
  };

  if (loading) {
    return <LoadingAnimelist />;
  }

  if (error !== '') {
    return error;
  }

  if (!user) {
    router.push('/auth/login');
  }

  return (
    <>
      <Head title="Animelist" />
      <AppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={12} md>
              <Typography variant="h4">
                {`${user.username}'s Animelist `}
                <Typography display="inline" sx={style.subtitle}>
                  — {list.filter((a) => a.title.toLowerCase().includes(search)).length.toLocaleString()}
                </Typography>
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
                <Tooltip title={layout === 'list' ? 'List Layout' : 'Grid Layout'} placement="top" arrow>
                  <IconButton onClick={toggleLayout}>
                    {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs sm="auto" textAlign="center">
                <TagEditorButton username={user.username} type="anime" />
              </Grid>
              <Grid item xs sm="auto" textAlign="center">
                <Tooltip title="Data not updated? Try sync" placement="top" arrow>
                  <IconButton onClick={() => callAPI(true)}>
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {list
            .filter((a) => a.title.toLowerCase().includes(search))
            .map((a) => {
              if (layout === 'grid') {
                return (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={a.id}>
                    <RenderIfVisible defaultHeight={200}>
                      <UserAnimeCard username={user.username} userAnime={a} />
                    </RenderIfVisible>
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} key={a.id}>
                  <RenderIfVisible defaultHeight={80}>
                    <UserAnimeList username={user.username} userAnime={a} />
                  </RenderIfVisible>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}

const LoadingAnimelist = () => {
  return (
    <>
      <Head title="Loading..." />
      <AppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              <Skeleton variant="rectangular" width={300} sx={{ maxWidth: '100%' }} />
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <CircularProgress color="warning" />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
