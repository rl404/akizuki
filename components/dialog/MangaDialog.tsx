import * as React from 'react';
import { UserManga } from '../../type/Types';
import { theme } from '../theme';
import moment, { Moment } from 'moment';
import { calculateFormula, extractVarFromFormula } from '../../lib/formula';
import { akizukiAxios } from '../../lib/axios';
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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { mangaStatusToStr, mangaTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import Link from 'next/link';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ConstructionIcon from '@mui/icons-material/Construction';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { defaultFormula, getUserFormula } from '../../lib/storage';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
};

const MangaDialog = ({
  open,
  onClose,
  username,
  userManga,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  userManga: UserManga;
  setData: (data: UserManga) => void;
}) => {
  const [showManga, setShowManga] = React.useState(false);
  const [userStatus, setUserStatus] = React.useState(userManga.userStatus);
  const [userChapter, setUserChapter] = React.useState(userManga.userChapter);
  const [userVolume, setUserVolume] = React.useState(userManga.userVolume);
  const [userScore, setUserScore] = React.useState(userManga.userScore);
  const [userStartDate, setUserStartDate] = React.useState(userManga.userStartDate);
  const [userEndDate, setUserEndDate] = React.useState(userManga.userEndDate);
  const [userComment, setUserComment] = React.useState(userManga.comments);
  const [userTags, setUserTags] = React.useState(userManga.tags);

  const onReset = () => {
    setUserStatus(userManga.userStatus);
    setUserChapter(userManga.userChapter);
    setUserVolume(userManga.userVolume);
    setUserScore(userManga.userScore);
    setUserStartDate(userManga.userStartDate);
    setUserEndDate(userManga.userEndDate);
    setUserComment(userManga.comments);
    setUserTags(userManga.tags);
  };

  const toggleShowManga = () => {
    setShowManga(!showManga);
  };

  const onChangeUserStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserStatus(e.target.value);
    if (e.target.value === 'completed') {
      setUserChapter(userManga.chapter);
      setUserVolume(userManga.volume);
    }
  };

  const onChangeUserChapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserChapter(parseInt(e.target.value, 10) || 0);
  };

  const decreaseChapter = () => {
    setUserChapter(userChapter - 1);
  };

  const increaseChapter = () => {
    setUserChapter(userChapter + 1);
  };

  const onChangeUserVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserVolume(parseInt(e.target.value, 10) || 0);
  };

  const decreaseVolume = () => {
    setUserVolume(userVolume - 1);
  };

  const increaseVolume = () => {
    setUserVolume(userVolume + 1);
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
    setUserTags([...userTags, ...userManga.genres.map((g) => g.toLowerCase()).filter((g) => !userTags.includes(g))]);
  };

  const tagsToComment = () => {
    setUserComment(userTags.join());
  };

  const formulaVarToTag = (name: string, value: number) => {
    const tag = `${name.replaceAll('_', '-')}:${value}`;
    !userTags.includes(tag) && setUserTags([...userTags, `${name.replaceAll('_', '-')}:${value}`]);
  };

  const [formula, setFormula] = React.useState('');
  const [formulaResult, setFormulaResult] = React.useState(0);
  const [formulaVars, setFormulaVars] = React.useState<{ [k: string]: number }>({});

  React.useEffect(() => {
    if (!username) return;

    axios
      .get(`/api/firebase/formula/${username}/manga`)
      .then((resp) => {
        if (resp.status === 202) {
          setFormula(getUserFormula('manga'));
          return;
        }

        setFormula(resp.data);
      })
      .catch((error) => {
        setFormula(defaultFormula);
        console.log(error);
      });
  }, [username]);

  React.useEffect(() => {
    const existVarTags: { [k: string]: number } = userTags
      .filter((t) => t.split(':').length === 2)
      .reduce((varTags, t) => {
        const split = t.split(':');
        return { ...varTags, [split[0].replaceAll('-', '_')]: parseInt(split[1]) || 0 };
      }, {});

    const newVars = extractVarFromFormula(formula).reduce((vars, v) => {
      return { ...vars, [v]: existVarTags[v] || 0 };
    }, {});

    setFormulaVars(newVars);
    setFormulaResult(calculateFormula(formula, newVars));
  }, [formula]);

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
      .patch(`/api/mal/mangalist/update`, {
        id: userManga.id,
        status: userStatus,
        score: userScore,
        chapter: userChapter,
        volume: userVolume,
        startDate: userStartDate,
        endDate: userEndDate,
        comment: userComment,
        tags: userTags,
      })
      .then(() => {
        setData({
          ...userManga,
          userStatus: userStatus,
          userScore: userScore,
          userChapter: userChapter,
          userVolume: userVolume,
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
    <Dialog open={open} maxWidth={showManga ? 'md' : 'sm'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Link href={`${WEB_MAL_HOST}/manga/${userManga.id}`} target="_blank">
            {userManga.title}
          </Link>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
          {!isSm && showManga && (
            <Grid container spacing={2} direction="column">
              <Grid item sx={{ textAlign: 'center' }}>
                <img
                  src={userManga.picture}
                  alt={userManga.title}
                  height={300}
                  style={{ objectFit: 'cover', borderRadius: 5, maxWidth: '100%' }}
                />
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={4}>
                  <Divider sx={style.subtitle}>Rank</Divider>
                  <Typography variant="h6" align="center">
                    <b>#{userManga.rank.toLocaleString()}</b>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Divider sx={style.subtitle}>Score</Divider>
                  <Typography variant="h6" align="center">
                    <b> {userManga.score.toLocaleString()}</b>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Divider sx={style.subtitle}>Popularity</Divider>
                  <Typography variant="h6" align="center">
                    <b>#{userManga.popularity.toLocaleString()}</b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <Divider sx={style.subtitle}>Status</Divider>
                  <Typography variant="h6" align="center">
                    <b> {mangaStatusToStr(userManga.status)}</b>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Divider sx={style.subtitle}>Type</Divider>
                  <Typography variant="h6" align="center">
                    <b> {mangaTypeToStr(userManga.mediaType)}</b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Synopsis</Divider>
                <Typography sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{userManga.synopsis}</Typography>
              </Grid>
              <Grid item sx={{ textAlign: 'center' }}>
                <Divider sx={{ ...style.subtitle, marginBottom: 1 }}>Genres</Divider>
                {userManga.genres.map((g) => {
                  return <Chip size="small" label={g} key={g} sx={{ margin: 0.5 }} color="warning" />;
                })}
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} direction={showManga ? 'column' : 'row'}>
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
              <TextField select label="Status" value={userStatus} onChange={onChangeUserStatus} size="small" fullWidth>
                <MenuItem value="reading">Reading</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="dropped">Dropped</MenuItem>
                <MenuItem value="plan_to_read">Plan to Read</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
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
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Chapter"
                  value={userChapter}
                  fullWidth
                  onChange={onChangeUserChapter}
                  size="small"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{`/ ${userManga.chapter}`}</InputAdornment>,
                  }}
                  sx={{ maxWidth: 'calc(100% - 48px)' }}
                />
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <IconButton size="small" onClick={decreaseChapter} disabled={userChapter <= 0}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </div>
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <IconButton
                    size="small"
                    onClick={increaseChapter}
                    disabled={userManga.chapter !== 0 && userChapter >= userManga.chapter}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>
              </Stack>
            </Grid>
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Volume"
                  value={userVolume}
                  fullWidth
                  onChange={onChangeUserVolume}
                  size="small"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{`/ ${userManga.volume}`}</InputAdornment>,
                  }}
                />
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <IconButton size="small" onClick={decreaseVolume} disabled={userVolume <= 0}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </div>
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <IconButton
                    size="small"
                    onClick={increaseVolume}
                    disabled={userManga.volume !== 0 && userVolume >= userManga.volume}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>
              </Stack>
            </Grid>
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
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
            <Grid item xs={showManga ? false : 12} sm={showManga ? false : 6}>
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
            <Grid item xs={showManga ? false : 12}>
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
                      <Chip label={option} {...getTagProps({ index })} size="small" color="warning" key={option} />
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
              <Grid item xs={showManga ? false : 12} container spacing={2}>
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
                  <Grid item xs={12} sm={showManga ? 12 : 6} key={v[0]}>
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
                      onBlur={() => v[1] !== 0 && formulaVarToTag(v[0], v[1])}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            <Grid item xs={showManga ? false : 12}>
              <TextField
                multiline
                fullWidth
                label="Comment"
                rows={3}
                value={userComment}
                onChange={onChangeUserComment}
                placeholder="your manga review..."
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
          <Button onClick={toggleShowManga} color="warning">
            {showManga ? 'hide manga' : 'Show Manga'}
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
};

export default MangaDialog;
