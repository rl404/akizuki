import { Data } from '@/app/api/mal/manga/route';
import RenderIfVisible from '@/src/components/commons/RenderIfVisible';
import UserMangaCover from '@/src/components/layouts/UserMangaCover';
import UserMangaList from '@/src/components/layouts/UserMangaList';
import theme from '@/src/components/theme';
import { Layout, UserManga, UserMangaStatus } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { getAxiosError } from '@/src/utils/utils';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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

export default function SearchMangaDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);

  const [list, setList] = useState<UserManga[]>([]);
  const [search, setSearch] = useState<string>('');
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('cover');
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [moreData, setMoreData] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const toggleLayout = () => setLayout(layout === 'cover' ? 'list' : 'cover');
  const toggleNsfw = () => setNsfw(!nsfw);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setError('');
  };

  const close = () => {
    onClose();
    setList([]);
    setSearch('');
    setCurrentSearch('');
    setNsfw(false);
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

  const callAPI = (reset = false, p = page) => {
    if (search.length < 3) {
      setError('at least 3 letters');
      return;
    }

    const limit = 20;

    akizukiAxios
      .get(`/api/mal/manga?query=${search}&offset=${(p - 1) * limit}&limit=${limit + 1}`)
      .then((resp) => {
        const data: Data = resp.data;

        const cnt = data.data.length;

        const tmp = data.data
          .filter((a) => reset || !list.find((l) => l.id === a.node.id))
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
            nsfw: a.node.nsfw != 'white',
            chapter: a.node.num_chapters || 0,
            volume: a.node.num_volumes || 0,
            mediaType: a.node.media_type || '',
            userStatus: a.node.my_list_status?.status || ('' as UserMangaStatus),
            userScore: a.node.my_list_status?.score || 0,
            userChapter: a.node.my_list_status.num_chapters_read || 0,
            userVolume: a.node.my_list_status.num_volumes_read || 0,
            userStartDate: a.node.my_list_status?.start_date || '',
            userEndDate: a.node.my_list_status?.finish_date || '',
            tags: a.node.my_list_status?.tags || [],
            comments: a.node.my_list_status?.comments || '',
          }));

        if (reset) {
          setList(tmp.slice(0, 20));
        } else {
          setList((l) => l.concat(tmp.slice(0, 20)));
        }

        cnt > limit ? setMoreData(true) : setMoreData(false);
        setPage(p + 1);
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoading(false));
  };

  const scrollToTop = () =>
    ref.current?.scroll({
      top: 0,
      behavior: 'smooth',
    });

  ref.current?.addEventListener('scroll', () => {
    if (!ref.current) return;
    if (ref.current.scrollTop > 200) {
      setScrollTop(true);
    } else {
      setScrollTop(false);
    }
  });

  return (
    <Dialog open={open} maxWidth="md" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
          <div>Search Manga</div>
          <IconButton onClick={close} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogTitle style={style.searchArea}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 'grow' }}>
            <TextField
              label="Search"
              placeholder="manga title..."
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
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <IconButton onClick={onSearch}>
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
              <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 'grow', sm: 'auto' }} textAlign="center">
            <Tooltip title={layout === 'list' ? 'List Layout' : 'Cover Layout'} placement="top" arrow>
              <IconButton onClick={toggleLayout}>
                {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers id="content-area" ref={ref} sx={{ position: 'relative' }}>
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
              <Grid container spacing={layout === 'list' ? 1 : 2}>
                {list.map((a) => {
                  switch (layout) {
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
            </InfiniteScroll>

            <div style={style.fabArea}>
              <Zoom in={scrollTop}>
                <Tooltip title="Scroll to Top" placement="left" arrow>
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
}
