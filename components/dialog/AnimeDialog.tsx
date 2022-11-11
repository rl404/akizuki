import * as React from 'react';
import {
  Autocomplete,
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
import { UserAnime } from '../../type/Types';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ClearIcon from '@mui/icons-material/Clear';
import moment, { Moment } from 'moment';
import { akizukiAxios } from '../../lib/axios';
import { theme } from '../theme';
import { animeStatusToStr, animeTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import ConstructionIcon from '@mui/icons-material/Construction';
import CloseIcon from '@mui/icons-material/Close';
import { getAnimeFormula } from '../../lib/storage';
import { calculateFormula, extractVarFromFormula } from '../../lib/formula';
import Link from 'next/link';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
};

export default function AnimeDialog({
  open,
  onClose,
  userAnime,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  userAnime: UserAnime;
  setData: (data: UserAnime) => void;
}) {
  const [showAnime, setShowAnime] = React.useState(false);
  const [userStatus, setUserStatus] = React.useState(userAnime.userStatus);
  const [userEpisode, setUserEpisode] = React.useState(userAnime.userEpisode);
  const [userScore, setUserScore] = React.useState(userAnime.userScore);
  const [userStartDate, setUserStartDate] = React.useState(userAnime.userStartDate);
  const [userEndDate, setUserEndDate] = React.useState(userAnime.userEndDate);
  const [userComment, setUserComment] = React.useState(userAnime.comments);
  const [userTags, setUserTags] = React.useState(userAnime.tags);

  const onReset = () => {
    setUserStatus(userAnime.userStatus);
    setUserEpisode(userAnime.userEpisode);
    setUserScore(userAnime.userScore);
    setUserStartDate(userAnime.userStartDate);
    setUserEndDate(userAnime.userEndDate);
    setUserComment(userAnime.comments);
    setUserTags(userAnime.tags);
  };

  const toggleShowAnime = () => {
    setShowAnime(!showAnime);
  };

  const onChangeUserStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserStatus(e.target.value);
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

  const onChangeUserTags = (_: any, v: Array<string>) => {
    setUserTags(v);
  };

  const onChangeUserComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserComment(e.target.value);
  };

  const [tools, setTools] = React.useState(false);

  const toggleTools = () => {
    setTools(!tools);
  };

  const genresToTags = () => {
    setUserTags([...userTags, ...userAnime.genres.map((g) => g.toLowerCase()).filter((g) => !userTags.includes(g))]);
  };

  const tagsToComment = () => {
    setUserComment(userTags.join());
  };

  const formulaVarToTag = (name: string, value: number) => {
    setUserTags([...userTags, `${name.replaceAll('_', '-')}:${value}`]);
  };

  const [formula, setFormula] = React.useState(getAnimeFormula());
  const [formulaResult, setFormulaResult] = React.useState(0);
  const [formulaVars, setFormulaVars] = React.useState<{ [k: string]: number }>(
    extractVarFromFormula(formula).reduce((vars, v) => {
      return { ...vars, [v]: 0 };
    }, {}),
  );

  const onChangeFormulaVar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVars = { ...formulaVars, [e.target.name]: parseInt(e.target.value) || 0 };
    setFormulaVars(newVars);
    setFormulaResult(calculateFormula(formula, newVars));
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onUpdate = () => {
    setLoading(true);

    akizukiAxios
      .patch(`/api/mal/animelist/update`, {
        id: userAnime.id,
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
          ...userAnime,
          status: userStatus,
          userScore: userScore,
          userEpisode: userEpisode,
          userStartDate: userStartDate,
          userEndDate: userEndDate,
          comments: userComment,
          tags: userTags,
        });
        onClose();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.error) {
            setError(error.response.error);
            return;
          }
          if (error.response.message) {
            setError(error.response.message);
            return;
          }
        }
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} maxWidth={showAnime ? 'md' : 'sm'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Link href={`${WEB_MAL_HOST}/anime/${userAnime.id}`} target="_blank">
            {userAnime.title}
          </Link>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
          {!isSm && showAnime && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <img
                  src={userAnime.picture}
                  alt={userAnime.title}
                  height={200}
                  style={{ objectFit: 'cover', borderRadius: 5 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Divider sx={style.subtitle}>Rank</Divider>
                <Typography variant="h6" align="center">
                  <b>#{userAnime.rank.toLocaleString()}</b>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Divider sx={style.subtitle}>Score</Divider>
                <Typography variant="h6" align="center">
                  <b> {userAnime.score.toLocaleString()}</b>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Divider sx={style.subtitle}>Popularity</Divider>
                <Typography variant="h6" align="center">
                  <b>#{userAnime.popularity.toLocaleString()}</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Divider sx={style.subtitle}>Status</Divider>
                <Typography variant="h6" align="center">
                  <b> {animeStatusToStr(userAnime.status)}</b>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Divider sx={style.subtitle}>Type</Divider>
                <Typography variant="h6" align="center">
                  <b> {animeTypeToStr(userAnime.mediaType)}</b>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Synopsis</Divider>
                <Typography sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{userAnime.synopsis}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Genres</Divider>
                {userAnime.genres.map((g) => {
                  return <Chip size="small" label={g} key={g} sx={{ margin: 0.5 }} color="warning" />;
                })}
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} direction={showAnime ? 'column' : 'row'}>
            <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 4}>
              <TextField select label="Status" value={userStatus} onChange={onChangeUserStatus} size="small" fullWidth>
                <MenuItem value="watching">Watching</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="dropped">Dropped</MenuItem>
                <MenuItem value="plan_to_watch">Plan to Watch</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={showAnime ? false : 12} sm={showAnime ? false : 4}>
              <TextField select label="Score" value={userScore} onChange={onChangeUserScore} size="small" fullWidth>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
                  return (
                    <MenuItem value={s} key={s}>
                      {s}
                    </MenuItem>
                  );
                })}
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
                    endAdornment: <InputAdornment position="end">{`/ ${userAnime.episode}`}</InputAdornment>,
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
                    disabled={userAnime.episode !== 0 && userEpisode >= userAnime.episode}
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
                                  <ClearIcon />
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
                                  <ClearIcon />
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
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  multiple
                  freeSolo
                  value={userTags}
                  options={[]}
                  fullWidth
                  size="small"
                  onChange={onChangeUserTags}
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip label={option} {...getTagProps({ index })} size="small" color="warning" />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" fullWidth placeholder="tags..." size="small" />
                  )}
                />
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <Tooltip title="Tools for tags editor" placement="right" arrow>
                    <IconButton onClick={toggleTools}>
                      <ConstructionIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Stack>
            </Grid>
            {tools && (
              <Grid item xs={showAnime ? false : 12} container spacing={2}>
                <Grid item xs={6}>
                  <Tooltip title="Add anime genres to tags" placement="bottom" arrow>
                    <Button variant="outlined" onClick={genresToTags} size="small" fullWidth color="warning">
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
                    <Button variant="outlined" onClick={tagsToComment} size="small" fullWidth color="warning">
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
                      endAdornment: <InputAdornment position="end">= {formulaResult.toFixed(2)}</InputAdornment>,
                    }}
                  />
                </Grid>
                {Object.entries(formulaVars).map((v) => (
                  <Grid item xs={12} sm={showAnime ? 12 : 6} key={v[0]}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        size="small"
                        fullWidth
                        name={v[0]}
                        value={formulaVars[v[0]]}
                        onChange={onChangeFormulaVar}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{v[0]} =</InputAdornment>,
                        }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <Tooltip title="Add to tag" placement="right" arrow>
                          <IconButton size="small" onClick={() => formulaVarToTag(v[0], v[1])}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        {error && (
          <Typography color="error" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        {!isSm && (
          <Button onClick={toggleShowAnime} color="warning">
            {showAnime ? 'hide anime' : 'Show Anime'}
          </Button>
        )}
        <Button onClick={onReset} color="warning" variant="outlined">
          Reset
        </Button>
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate} color="warning">
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
