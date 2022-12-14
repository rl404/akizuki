import { useRouter } from 'next/router';
import * as React from 'react';
import { theme } from '../components/theme';
import { akizukiAxios } from '../lib/axios';
import { getUser, getUserMangalist, saveUserMangalist } from '../lib/storage';
import { User, UserManga } from '../type/Types';
import { Data } from './api/mal/mangalist';
import Head from '../components/head/Head';
import AppBar from '../components/bar/AppBar';
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
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TagEditorButton from '../components/button/TagEditorButton';
import SyncIcon from '@mui/icons-material/Sync';
import RenderIfVisible from 'react-render-if-visible';
import UserMangaCard from '../components/card/UserMangaCard';
import UserMangaList from '../components/list/UserMangaList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link';
import { WEB_MAL_HOST } from '../lib/myanimelist';
import AddMangaButton from '../components/button/AddMangaButton';

const statusOrder = ['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'];

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
  link: {
    'a:hover': {
      color: theme.palette.warning.main,
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
};

export default function Mangalist() {
  const router = useRouter();

  const [user, setUser] = React.useState<User>({ username: '', picture: '' });
  const [list, setList] = React.useState<Array<UserManga>>([]);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);

  const [layout, setLayout] = React.useState<string>('grid');

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const [nsfw, setNsfw] = React.useState<boolean>(false);

  const toggleNsfw = () => {
    setNsfw(!nsfw);
  };

  const callAPI = (withLoading: boolean = false) => {
    withLoading && setLoading(true);

    akizukiAxios
      .get(`/api/mal/mangalist`)
      .then((resp) => {
        const data: Data = resp.data;

        const tmp: Array<UserManga> = data
          .map<UserManga>((a) => {
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
              nsfw: a.node.nsfw !== 'white',
              chapter: a.node.num_chapters || 0,
              volume: a.node.num_volumes || 0,
              mediaType: a.node.media_type || '',
              userStatus: a.list_status.status || '',
              userScore: a.list_status.score || 0,
              userChapter: a.list_status.num_chapters_read || 0,
              userVolume: a.list_status.num_volumes_read || 0,
              userStartDate: a.list_status.start_date || '',
              userEndDate: a.list_status.finish_date || '',
              tags: a.list_status.tags || [],
              comments: a.list_status.comments || '',
            };
          })
          .sort((a: UserManga, b: UserManga): number => {
            const i = statusOrder.indexOf(a.userStatus);
            const j = statusOrder.indexOf(b.userStatus);

            if (i === j) {
              return a.title < b.title ? -1 : 1;
            }

            return i - j;
          });

        setList(tmp);
        saveUserMangalist(tmp);
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

    const cached = getUserMangalist();
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
    return <LoadingMangalist />;
  }

  if (error !== '') {
    return error;
  }

  if (!user) {
    router.push('/auth/login');
  }

  return (
    <>
      <Head title="Mangalist" />
      <AppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={12} md>
              <Typography variant="h4" sx={style.link}>
                <Link href={`${WEB_MAL_HOST}/mangalist/${user.username}`} target="_blank">
                  {`${user.username}'s Mangalist `}
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
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>Reading</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {list
                            .filter((a) => a.title.toLowerCase().includes(search) && a.userStatus === 'reading')
                            .length.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>Completed</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {list
                            .filter((a) => a.title.toLowerCase().includes(search) && a.userStatus === 'completed')
                            .length.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>On-Hold</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {list
                            .filter((a) => a.title.toLowerCase().includes(search) && a.userStatus === 'on_hold')
                            .length.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>Dropped</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {list
                            .filter((a) => a.title.toLowerCase().includes(search) && a.userStatus === 'dropped')
                            .length.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={style.subtitle}>Plan to Read</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography textAlign="right">
                          {list
                            .filter((a) => a.title.toLowerCase().includes(search) && a.userStatus === 'plan_to_read')
                            .length.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                >
                  <Typography display="inline" sx={style.subtitle}>
                    ??? {list.filter((a) => a.title.toLowerCase().includes(search)).length.toLocaleString()}
                  </Typography>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item container spacing={1} xs={12} sm={12} md="auto">
              <Grid item xs={12} sm>
                <TextField
                  label="Search"
                  placeholder="manga title..."
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
                <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
                  <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs sm="auto" textAlign="center">
                <TagEditorButton username={user.username} type="manga" />
              </Grid>
              <Grid item xs sm="auto" textAlign="center">
                <AddMangaButton username={user.username} />
              </Grid>
              <Grid item xs sm="auto" textAlign="center">
                <Tooltip title="Data not updated? Try sync" placement="top" arrow>
                  <IconButton onClick={() => callAPI(true)}>
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          {list
            .filter((a) => a.title.toLowerCase().includes(search))
            .map((a) => {
              if (layout === 'grid') {
                return (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={a.id}>
                    <RenderIfVisible defaultHeight={200}>
                      <UserMangaCard username={user.username} userManga={a} nsfw={nsfw} />
                    </RenderIfVisible>
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} key={a.id}>
                  <RenderIfVisible defaultHeight={80}>
                    <UserMangaList username={user.username} userManga={a} />
                  </RenderIfVisible>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}

const LoadingMangalist = () => {
  return (
    <>
      <Head title="Mangalist" />
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
