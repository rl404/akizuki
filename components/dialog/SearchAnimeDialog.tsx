import * as React from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Zoom,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { akizukiAxios } from '../../lib/axios';
import { Data } from '../../pages/api/mal/anime';
import SearchIcon from '@mui/icons-material/Search';
import RenderIfVisible from 'react-render-if-visible';
import AnimeCard from '../card/AnimeCard';
import { UserAnime } from '../../type/Types';
import { theme } from '../theme';
import InfiniteScroll from 'react-infinite-scroll-component';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AnimeList from '../list/AnimeList';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';

const style = {
  searchArea: {
    borderTop: '1px solid ' + theme.palette.divider,
  },
  loadingArea: {
    width: '100%',
    textAlign: 'center' as 'center',
    paddingTop: 10,
  },
  fabArea: {
    position: 'absolute' as 'absolute',
    bottom: '56px',
    right: '56px',
  },
  fab: {
    position: 'fixed',
  },
};

const SearchAnimeDialog = ({ open, onClose, username }: { open: boolean; onClose: () => void; username: string }) => {
  const searchRef = React.useRef<HTMLElement>();

  const [list, setList] = React.useState<Array<UserAnime>>([]);
  const [search, setSearch] = React.useState<string>('');
  const [currentSearch, setCurrentSearch] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [moreData, setMoreData] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [scrollTop, setScrollTop] = React.useState<boolean>(false);

  const [layout, setLayout] = React.useState<string>('grid');

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const [nsfw, setNsfw] = React.useState<boolean>(false);

  const toggleNsfw = () => {
    setNsfw(!nsfw);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setError('');
  };

  const close = () => {
    onClose();
    setList([]);
    setSearch('');
    setCurrentSearch('');
    setPage(1);
    setMoreData(false);
    setError('');
  };

  const onSearch = () => {
    if (search === currentSearch) return;
    setLoading(true);
    callAPI(true, 1);
    setCurrentSearch(search);
    scrollToTop();
  };

  const callAPI = async (reset = false, p = page) => {
    if (search.length < 3) {
      setError('at least 3 letters');
      return;
    }

    const limit = 20;

    await akizukiAxios
      .get(`/api/mal/anime?query=${search}&offset=${(p - 1) * limit}&limit=${limit + 1}`)
      .then((resp) => {
        const data: Data = resp.data;

        const cnt = data.data.length;

        const tmp = data.data
          .filter((a) => reset || !list.find((l) => l.id === a.node.id))
          .map((a) => {
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
              nsfw: a.node.nsfw != 'white',
              episode: a.node.num_episodes || 0,
              mediaType: a.node.media_type || '',
              userStatus: a.node.my_list_status?.status || '',
              userScore: a.node.my_list_status?.score || 0,
              userEpisode: a.node.my_list_status?.num_episodes_watched || 0,
              userStartDate: a.node.my_list_status?.start_date || '',
              userEndDate: a.node.my_list_status?.finish_date || '',
              tags: a.node.my_list_status?.tags || [],
              comments: a.node.my_list_status?.comments || '',
            };
          });

        if (reset) {
          setList(tmp.slice(0, 20));
        } else {
          setList((l) => l.concat(tmp.slice(0, 20)));
        }

        cnt > limit ? setMoreData(true) : setMoreData(false);
        setPage(p + 1);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            setError(error.response.data.message);
            return;
          }
          setError(error.response.message);
          return;
        }
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const scrollToTop = () => {
    searchRef.current?.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  searchRef.current?.addEventListener('scroll', () => {
    if (!searchRef.current) return;
    if (searchRef.current.scrollTop > 200) {
      setScrollTop(true);
    } else {
      setScrollTop(false);
    }
  });

  return (
    <Dialog open={open} maxWidth="md" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <div>Search Anime</div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton onClick={close} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </DialogTitle>
      <DialogTitle style={style.searchArea}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm>
            <TextField
              label="Search"
              placeholder="anime title..."
              value={search}
              fullWidth
              autoFocus
              onChange={onChangeSearch}
              size="small"
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              error={error !== ''}
              helperText={error}
            />
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <IconButton onClick={onSearch}>
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
              <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs sm="auto" textAlign="center">
            <Tooltip title={layout === 'list' ? 'List Layout' : 'Grid Layout'} placement="top" arrow>
              <IconButton onClick={toggleLayout}>
                {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers id="content-area" ref={searchRef} sx={{ position: 'relative' }}>
        {loading ? (
          <div style={style.loadingArea}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <InfiniteScroll
              dataLength={list.length}
              next={callAPI}
              hasMore={moreData}
              scrollableTarget="content-area"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'unset' }}
              loader={
                <div style={style.loadingArea}>
                  <CircularProgress />
                </div>
              }
            >
              <Grid container spacing={layout === 'grid' ? 2 : 1}>
                {list.map((a) => {
                  if (layout === 'grid') {
                    return (
                      <Grid item xs={6} sm={3} md={2} lg={2} key={a.id}>
                        <RenderIfVisible defaultHeight={200}>
                          <AnimeCard username={username} userAnime={a} nsfw={nsfw} />
                        </RenderIfVisible>
                      </Grid>
                    );
                  }

                  return (
                    <Grid item xs={12} key={a.id}>
                      <RenderIfVisible defaultHeight={80}>
                        <AnimeList username={username} userAnime={a} />
                      </RenderIfVisible>
                    </Grid>
                  );
                })}
              </Grid>
            </InfiniteScroll>

            <div style={style.fabArea}>
              <Zoom in={scrollTop}>
                <Tooltip title="Scroll to top" placement="left" arrow>
                  <Fab sx={style.fab} onClick={scrollToTop} color="primary" size="small">
                    <UpIcon />
                  </Fab>
                </Tooltip>
              </Zoom>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchAnimeDialog;
