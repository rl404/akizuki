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
  Skeleton,
  Stack,
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

const statusOrder = ['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'];

const style = {
  subtitle: {
    color: theme.palette.grey[600],
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

  const callAPI = (withLoading: boolean = false) => {
    withLoading && setLoading(true);

    akizukiAxios
      .get(`api/mal/mangalist`)
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
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="h4" gutterBottom sx={{ flex: 1 }}>
                {`${user.username}'s Mangalist `}
                <Typography display="inline" sx={style.subtitle}>
                  — {list.length.toLocaleString()}
                </Typography>
              </Typography>
              <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <Tooltip title={layout === 'list' ? 'List Layout' : 'Grid Layout'} placement="top" arrow>
                  <IconButton onClick={toggleLayout}>
                    {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
                  </IconButton>
                </Tooltip>
              </div>
              <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <TagEditorButton username={user.username} type="manga" />
              </div>
              <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <Tooltip title="Data not updated? Try sync" placement="top" arrow>
                  <IconButton onClick={() => callAPI(true)}>
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Stack>
            <Divider />
          </Grid>
          {list.map((a) => {
            if (layout === 'grid') {
              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={a.id}>
                  <RenderIfVisible defaultHeight={200}>
                    <UserMangaCard username={user.username} userManga={a} />
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
