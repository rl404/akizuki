'use client';

import { Data } from '@/app/api/mal/manga/route';
import AddMangaButton from '@/src/components/buttons/AddMangaButton';
import TagEditorButton from '@/src/components/buttons/TagEditorButton';
import RenderIfVisible from '@/src/components/commons/RenderIfVisible';
import UserMangaCard from '@/src/components/layouts/UserMangaCard';
import UserMangaCover from '@/src/components/layouts/UserMangaCover';
import UserMangaList from '@/src/components/layouts/UserMangaList';
import theme from '@/src/components/theme';
import { Layout, User, UserManga, UserMangaStatus } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { UserMangaStatuses } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import { getUser, getUserMangalist, saveUserMangalist } from '@/src/utils/user';
import { getAxiosError } from '@/src/utils/utils';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

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

export default function Mangalist() {
  const [user, setUser] = useState<User>();
  const [userMangaAll, setUserMangaAll] = useState<UserManga[]>([]);
  const [userManga, setUserManga] = useState<UserManga[]>([]);
  const [search, setSearch] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('card');
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSync, setLoadingSync] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setUser(getUser());

    const cached = getUserMangalist();
    if (cached) {
      setUserMangaAll(cached);
      setLoading(false);
    }

    callAPI();
  }, []);

  const callAPI = (withLoading = false) => {
    if (withLoading) setLoading(true);
    if (withLoading) setLoadingSync(true);

    akizukiAxios
      .get(`/api/mal/usermanga`)
      .then((resp) => {
        const data: Data = resp.data;

        const tmp: UserManga[] = data.data
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
            chapter: a.node.num_chapters || 0,
            volume: a.node.num_volumes || 0,
            mediaType: a.node.media_type || '',
            userStatus: a.node.my_list_status.status || ('' as UserMangaStatus),
            userScore: a.node.my_list_status.score || 0,
            userChapter: a.node.my_list_status.num_chapters_read || 0,
            userVolume: a.node.my_list_status.num_volumes_read || 0,
            userStartDate: a.node.my_list_status.start_date || '',
            userEndDate: a.node.my_list_status.finish_date || '',
            tags: a.node.my_list_status.tags || [],
            comments: a.node.my_list_status.comments || '',
          }))
          .sort((a, b) => {
            const i = UserMangaStatuses.findIndex((x) => x.status === a.userStatus);
            const j = UserMangaStatuses.findIndex((x) => x.status === b.userStatus);
            if (i === j) return a.title < b.title ? -1 : 1;
            return i - j;
          });

        setUserMangaAll(tmp);
        saveUserMangalist(tmp);
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
    setUserManga(
      userMangaAll.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.synonyms.join(',').toLowerCase().includes(search) ||
          a.enTitle.toLowerCase().includes(search) ||
          a.jpTitle.toLowerCase().includes(search),
      ),
    );
  }, [userMangaAll, search]);

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
      <Grid size={12} container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 'grow' }}>
          <Typography variant="h4" sx={style.link}>
            <Link href={`${MAL_WEB_HOST}/mangalist/${user.username}`} target="_blank">
              {`${user.username}'s Mangalist `}
            </Link>
            <Tooltip
              placement="right"
              arrow
              slotProps={{
                tooltip: {
                  sx: style.tooltipCount,
                },
              }}
              title={
                <Grid container spacing={0.5} sx={{ width: 200 }}>
                  {UserMangaStatuses.map((s) => (
                    <Fragment key={s.label}>
                      <Grid size={7}>
                        <Typography sx={style.subtitle}>{s.label}</Typography>
                      </Grid>
                      <Grid size={5}>
                        <Typography textAlign="right">
                          {userManga.filter((a) => a.userStatus === s.status).length.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Fragment>
                  ))}
                </Grid>
              }
            >
              <Typography display="inline" sx={style.subtitle}>
                — {userManga.length.toLocaleString()}
              </Typography>
            </Tooltip>
          </Typography>
        </Grid>
        <Grid container spacing={1} size={{ xs: 12, sm: 12, md: 'auto' }}>
          <Grid size={{ xs: 12, sm: 'grow' }}>
            <TextField
              label="Search"
              placeholder="manga title..."
              size="small"
              fullWidth
              value={search}
              onChange={onSearch}
              slotProps={{
                input: {
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
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
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
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
              <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <TagEditorButton type="manga" />
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <AddMangaButton />
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
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
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12} container spacing={layout === 'list' ? 1 : 2}>
        {userManga.map((a) => {
          switch (layout) {
            case 'card':
              return (
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={a.id}>
                  <RenderIfVisible defaultHeight={200}>
                    <UserMangaCard userManga={a} nsfw={nsfw} />
                  </RenderIfVisible>
                </Grid>
              );
            case 'cover':
              return (
                <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }} key={a.id}>
                  <RenderIfVisible defaultHeight={200}>
                    <UserMangaCover userManga={a} nsfw={nsfw} />
                  </RenderIfVisible>
                </Grid>
              );
            case 'list':
              return (
                <Grid size={12} key={a.id}>
                  <RenderIfVisible defaultHeight={40}>
                    <UserMangaList userManga={a} />
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
    <Grid size={12}>
      <Typography variant="h4" gutterBottom>
        <Skeleton variant="rectangular" width={300} sx={{ maxWidth: '100%' }} />
      </Typography>
      <Divider />
    </Grid>
    <Grid size={12} sx={{ textAlign: 'center' }}>
      <CircularProgress />
    </Grid>
  </Grid>
);
