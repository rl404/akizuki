import theme from '@/src/components/theme';
import { UserAnime, UserAnimeStatus } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { AnimeStatusStr, AnimeTypeStr } from '@/src/utils/const';
import { calculateFormula, extractVarFromFormula, getUserFormula } from '@/src/utils/formula';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import { getAxiosError } from '@/src/utils/utils';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ConstructionIcon from '@mui/icons-material/Construction';
import RemoveIcon from '@mui/icons-material/Remove';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
    userSelect: 'none',
  },
  link: {
    'a:hover': {
      color: theme.palette.primary.main,
    },
  },
};

export default function UserAnimeDialog({
  open,
  onClose,
  data,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  data: UserAnime;
  setData: (data: UserAnime) => void;
}) {
  const [showAnime, setShowAnime] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<UserAnimeStatus>(data.userStatus);
  const [userEpisode, setUserEpisode] = useState<number>(data.userEpisode);
  const [userScore, setUserScore] = useState<number>(data.userScore);
  const [userStartDate, setUserStartDate] = useState<string>(data.userStartDate);
  const [userEndDate, setUserEndDate] = useState<string>(data.userEndDate);
  const [userComment, setUserComment] = useState<string>(data.comments);
  const [userTags, setUserTags] = useState<string[]>(data.tags);
  const [tools, setTools] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setUserStatus(data.userStatus);
    setUserEpisode(data.userEpisode);
    setUserScore(data.userScore);
    setUserStartDate(data.userStartDate);
    setUserEndDate(data.userEndDate);
  }, [data]);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const onReset = () => {
    setUserStatus(data.userStatus);
    setUserEpisode(data.userEpisode);
    setUserScore(data.userScore);
    setUserStartDate(data.userStartDate);
    setUserEndDate(data.userEndDate);
    setUserComment(data.comments);
    setUserTags(data.tags);
  };

  const toggleShowAnime = () => setShowAnime(!showAnime);

  const onChangeUserStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserStatus(e.target.value as UserAnimeStatus);
    if (e.target.value === 'completed') {
      setUserEpisode(data.episode);
    }
  };

  const onChangeUserEpisode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEpisode(parseInt(e.target.value, 10) || 0);
  };

  const decreaseEpisode = () => {
    setUserEpisode(userEpisode - 1);
  };

  const increaseEpisode = () => {
    setUserEpisode(userEpisode + 1);
  };

  const onChangeUserScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserScore(parseInt(e.target.value, 10) || 0);
  };

  const onChangeUserStartDate = (v: Moment | null) => {
    setUserStartDate(v?.format('YYYY-MM-DD') || '');
  };

  const resetUserStartDate = () => {
    setUserStartDate('');
  };

  const onChangeUserEndDate = (v: Moment | null) => {
    setUserEndDate(v?.format('YYYY-MM-DD') || '');
  };

  const resetUserEndDate = () => {
    setUserEndDate('');
  };

  const onChangeUserTags = (_: any, v: any) => {
    setUserTags(v);
  };

  const onChangeUserComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserComment(e.target.value);
  };

  const toggleTools = () => {
    setTools(!tools);
  };

  const genresToTags = () => {
    setUserTags([...userTags, ...data.genres.map((g) => g.toLowerCase()).filter((g) => !userTags.includes(g))]);
  };

  const tagsToComment = () => {
    setUserComment(userTags.join());
  };

  const formulaVarsToTag = (name: string, value: number) => {
    name = name.replaceAll('_', '-');
    const tag = `${name}:${value}`;
    const existUserTags = userTags.filter((t) => name !== t.split(':')[0]);
    !existUserTags.includes(tag) && setUserTags([...existUserTags, `${name}:${value}`]);
  };

  const onUpdate = () => {
    setLoading(true);

    akizukiAxios
      .put(`/api/mal/useranime/update`, {
        id: data.id,
        status: userStatus,
        score: userScore,
        episode: userEpisode,
        startDate: userStartDate,
        endDate: userEndDate,
        comment: userComment,
        tags: userTags,
      })
      .then(() => {
        setData({
          ...data,
          userStatus: userStatus,
          userScore: userScore,
          userEpisode: userEpisode,
          userStartDate: userStartDate,
          userEndDate: userEndDate,
          comments: userComment,
          tags: userTags,
        });
        onClose();
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoading(false));
  };

  const onDelete = () => {
    setLoadingDelete(true);

    akizukiAxios
      .delete(`/api/mal/useranime/delete/${data.id}`)
      .then(() => {
        setData({
          ...data,
          userStatus: '',
          userScore: 0,
          userEpisode: 0,
          userStartDate: '',
          userEndDate: '',
          comments: '',
          tags: [],
        });
        onClose();
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoadingDelete(false));
  };

  return (
    <Dialog open={open} maxWidth={showAnime ? 'md' : 'sm'} fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={style.link}>
          <Link href={`${MAL_WEB_HOST}/anime/${data.id}`} target="_blank">
            {data.title}
          </Link>
          <div>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={showAnime && !isSm ? 2 : 0}
        >
          {showAnime && <AnimeDetails data={data} />}
          {(!showAnime || !isSm) && (
            <Grid container spacing={2} direction={showAnime ? 'column' : 'row'}>
              <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 4}>
                <TextField
                  select
                  label="Status"
                  value={userStatus}
                  onChange={onChangeUserStatus}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="watching">Watching</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="dropped">Dropped</MenuItem>
                  <MenuItem value="plan_to_watch">Plan to Watch</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 4}>
                <TextField select label="Score" value={userScore} onChange={onChangeUserScore} size="small" fullWidth>
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((s) => (
                    <MenuItem value={s} key={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 4}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Episode"
                    value={userEpisode}
                    fullWidth
                    onChange={onChangeUserEpisode}
                    size="small"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{`/ ${data.episode}`}</InputAdornment>,
                    }}
                  />
                  <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <IconButton size="small" onClick={decreaseEpisode} disabled={userEpisode <= 0}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <IconButton
                      size="small"
                      onClick={increaseEpisode}
                      disabled={data.episode !== 0 && userEpisode >= data.episode}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Stack>
              </Grid>
              <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 6}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Start Date"
                    value={userStartDate === '' ? null : userStartDate}
                    onChange={onChangeUserStartDate}
                    inputFormat="YYYY-MM-DD"
                    disableFuture
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps?.endAdornment}
                              {userStartDate !== '' && (
                                <InputAdornment position="end">
                                  <IconButton onClick={resetUserStartDate}>
                                    <CloseIcon />
                                  </IconButton>
                                </InputAdornment>
                              )}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 6}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="End Date"
                    value={userEndDate === '' ? null : userEndDate}
                    onChange={onChangeUserEndDate}
                    inputFormat="YYYY-MM-DD"
                    disableFuture
                    minDate={userStartDate !== '' ? moment(userStartDate) : undefined}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps?.endAdornment}
                              {userEndDate !== '' && (
                                <InputAdornment position="end">
                                  <IconButton onClick={resetUserEndDate}>
                                    <CloseIcon />
                                  </IconButton>
                                </InputAdornment>
                              )}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={showAnime ? false : 12}>
                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                  <Autocomplete
                    multiple
                    freeSolo
                    value={userTags}
                    options={[]}
                    fullWidth
                    size="small"
                    onChange={onChangeUserTags}
                    sx={{ '& .MuiAutocomplete-tag': { maxWidth: '200px' } }}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip {...getTagProps({ index })} label={option} size="small" color="primary" key={option} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Tags" fullWidth placeholder="tags..." size="small" />
                    )}
                  />
                  <Box>
                    <Tooltip title="Tools for Tags Editor" placement="right" arrow>
                      <IconButton onClick={toggleTools}>
                        <ConstructionIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </Grid>
              {tools && (
                <AnimeTools
                  showAnime={showAnime}
                  userTags={userTags}
                  genresToTags={genresToTags}
                  tagsToComment={tagsToComment}
                  formulaVarsToTag={formulaVarsToTag}
                />
              )}
              <Grid item xs={showAnime ? false : 12}>
                <TextField
                  multiline
                  fullWidth
                  label="Comment"
                  rows={3}
                  value={userComment}
                  onChange={onChangeUserComment}
                  placeholder="your anime review..."
                  size="small"
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {data.userStatus !== '' && (
          <>
            <LoadingButton onClick={onDelete} color="error" variant="outlined" loading={loadingDelete}>
              Delete
            </LoadingButton>
            <Box sx={{ flex: 1 }} />
          </>
        )}
        {error && (
          <Typography color="error" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        <Button onClick={toggleShowAnime}>{showAnime ? 'Hide Anime' : 'Show Anime'}</Button>
        <Button onClick={onReset} variant="outlined">
          Reset
        </Button>
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate}>
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

const AnimeDetails = ({ data }: { data: UserAnime }) => (
  <Grid container spacing={2} direction="column">
    <Grid item sx={{ textAlign: 'center' }}>
      <img
        src={data.picture}
        alt={data.title}
        height={300}
        style={{
          objectFit: 'cover',
          borderRadius: 5,
          maxWidth: '100%',
        }}
      />
    </Grid>
    <Grid item container spacing={2}>
      <Grid item xs={4}>
        <Divider sx={style.subtitle}>Rank</Divider>
        <Typography variant="h6" align="center">
          <b>#{data.rank.toLocaleString()}</b>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider sx={style.subtitle}>Score</Divider>
        <Typography variant="h6" align="center">
          <b>{data.score.toLocaleString()}</b>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider sx={style.subtitle}>Popularity</Divider>
        <Typography variant="h6" align="center">
          <b>#{data.popularity.toLocaleString()}</b>
        </Typography>
      </Grid>
    </Grid>
    <Grid item container spacing={2}>
      <Grid item xs={6}>
        <Divider sx={style.subtitle}>Status</Divider>
        <Typography variant="h6" align="center">
          <b>{AnimeStatusStr(data.status)}</b>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Divider sx={style.subtitle}>Type</Divider>
        <Typography variant="h6" align="center">
          <b>{AnimeTypeStr(data.mediaType)}</b>
        </Typography>
      </Grid>
    </Grid>
    <Grid item>
      <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Synopsis</Divider>
      <Typography sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{data.synopsis}</Typography>
    </Grid>
    <Grid item sx={{ textAlign: 'center' }}>
      <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Genres</Divider>
      <Stack direction="row" justifyContent="center" gap={1} flexWrap="wrap">
        {data.genres.map((g) => (
          <Chip key={g} label={g} size="small" color="primary" />
        ))}
      </Stack>
    </Grid>
  </Grid>
);

const AnimeTools = ({
  showAnime,
  userTags,
  genresToTags,
  tagsToComment,
  formulaVarsToTag,
}: {
  showAnime: boolean;
  userTags: string[];
  genresToTags: () => void;
  tagsToComment: () => void;
  formulaVarsToTag: (name: string, value: number) => void;
}) => {
  const [formula, setFormula] = useState<string>('');
  const [vars, setVars] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setFormula(getUserFormula('anime'));
  }, [userTags]);

  useEffect(() => {
    const existVarTags: { [k: string]: number } = userTags
      .filter((t) => t.split(':').length === 2)
      .reduce((varTags, t) => {
        const split = t.split(':');
        return { ...varTags, [split[0].replaceAll('-', '_')]: parseInt(split[1]) || 0 };
      }, {});

    const newVars = extractVarFromFormula(formula).reduce((vars, v) => ({ ...vars, [v]: existVarTags[v] || 0 }), {});

    setVars(newVars);
  }, [userTags, formula]);

  useEffect(() => {
    setResult(calculateFormula(formula, vars) || 0);
  }, [formula, vars]);

  const onChangeVar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVars({ ...vars, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  return (
    <Grid item xs={showAnime ? false : 12} container spacing={2}>
      <Grid item xs={6}>
        <Tooltip title="Add anime genres to tags" placement="bottom" arrow>
          <Button variant="outlined" onClick={genresToTags} size="small" fullWidth>
            genres to tags
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={6}>
        <Tooltip
          title="Replace comment with tags. Useful in case you have written your review in tags field and want to move it to comment field."
          placement="bottom"
          arrow
        >
          <Button variant="outlined" onClick={tagsToComment} size="small" fullWidth>
            tags to comment
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          fullWidth
          label="Formula"
          size="small"
          defaultValue={formula}
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end">= {result.toFixed(2)}</InputAdornment>,
          }}
        />
      </Grid>
      {Object.entries(vars).map((v) => (
        <Grid item xs={12} sm={showAnime ? 12 : 6} key={v[0]}>
          <TextField
            size="small"
            fullWidth
            name={v[0]}
            value={vars[v[0]]}
            onChange={onChangeVar}
            onBlur={() => v[1] !== 0 && formulaVarsToTag(v[0], v[1])}
            InputProps={{
              startAdornment: <InputAdornment position="start">{v[0]} =</InputAdornment>,
            }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};
