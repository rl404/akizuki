import * as React from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { akizukiAxios } from '../../lib/axios';
import { Data } from '../../pages/api/mal/manga';
import SearchIcon from '@mui/icons-material/Search';
import RenderIfVisible from 'react-render-if-visible';
import MangaCard from '../card/MangaCard';
import { UserManga } from '../../type/Types';
import { theme } from '../theme';
import InfiniteScroll from 'react-infinite-scroll-component';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MangaList from '../list/MangaList';

const style = {
  searchArea: {
    borderTop: '1px solid ' + theme.palette.divider,
  },
  loadingArea: {
    width: '100%',
    textAlign: 'center' as 'center',
    paddingTop: 10,
  },
};

const SearchMangaDialog = ({ open, onClose, username }: { open: boolean; onClose: () => void; username: string }) => {
  const [list, setList] = React.useState<Array<UserManga>>([]);
  const [search, setSearch] = React.useState<string>('');
  const [currentSearch, setCurrentSearch] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [moreData, setMoreData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

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
    search !== currentSearch && callAPI(true, 1);
    setCurrentSearch(search);
  };

  const callAPI = async (reset = false, p = page) => {
    if (search.length < 3) {
      setError('at least 3 letters');
      return;
    }

    const limit = 20;

    await akizukiAxios
      .get(`/api/mal/manga?query=${search}&offset=${(p - 1) * limit}&limit=${limit + 1}`)
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
              chapter: a.node.num_chapters || 0,
              volume: a.node.num_volumes || 0,
              mediaType: a.node.media_type || '',
              userStatus: a.node.my_list_status?.status || '',
              userScore: a.node.my_list_status?.score || 0,
              userChapter: a.node.my_list_status?.num_chapters_read || 0,
              userVolume: a.node.my_list_status?.num_volumes_read || 0,
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
      });
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <div>Search Manga</div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton onClick={close} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </DialogTitle>
      <DialogTitle style={style.searchArea}>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Search"
            placeholder="manga title..."
            value={search}
            fullWidth
            onChange={onChangeSearch}
            size="small"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            error={error !== ''}
            helperText={error}
          />
          <div>
            <IconButton onClick={onSearch}>
              <SearchIcon />
            </IconButton>
          </div>
          <div>
            <Tooltip title={nsfw ? 'Show NSFW' : 'Hide NSFW'} placement="top" arrow>
              <IconButton onClick={toggleNsfw}>{nsfw ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip title={layout === 'list' ? 'List Layout' : 'Grid Layout'} placement="top" arrow>
              <IconButton onClick={toggleLayout}>
                {layout === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Stack>
      </DialogTitle>
      <DialogContent dividers id="content-area">
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
                  <Grid item xs={4} sm={3} md={2} lg={2} key={a.id}>
                    <RenderIfVisible defaultHeight={200}>
                      <MangaCard username={username} userManga={a} nsfw={nsfw} />
                    </RenderIfVisible>
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} key={a.id}>
                  <RenderIfVisible defaultHeight={80}>
                    <MangaList username={username} userManga={a} />
                  </RenderIfVisible>
                </Grid>
              );
            })}
          </Grid>
        </InfiniteScroll>
      </DialogContent>
    </Dialog>
  );
};

export default SearchMangaDialog;
