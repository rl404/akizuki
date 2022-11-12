import * as React from 'react';
import {
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
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  defaultFormula,
  getAnimeFormula,
  getMangaFormula,
  saveAnimeFormula,
  saveMangaFormula,
} from '../../lib/storage';
import { calculateFormula, extractVarFromFormula, isFormulaValid } from '../../lib/formula';
import { theme } from '../theme';

export default function TagDialog({ open, onClose, type }: { open: boolean; onClose: () => void; type: string }) {
  const [formula, setFormula] = React.useState<string>(type === 'anime' ? getAnimeFormula() : getMangaFormula());
  const [vars, setVars] = React.useState<{ [k: string]: number }>({});
  const [result, setResult] = React.useState<number>(0);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    updateVars(formula);
  }, [formula]);

  const updateVars = (f: string) => {
    const v = extractVarFromFormula(f);

    setVars(() => {
      return {};
    });

    v.forEach((vv: string) => {
      setVars((k) => {
        return { ...k, [vv]: 0 };
      });
    });
  };

  const onChangeFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((s) => {
      return '';
    });

    setFormula(e.target.value);

    if (!isFormulaValid(e.target.value)) {
      setError((s) => {
        return 'invalid formula';
      });
      return;
    }

    updateVars(e.target.value);
  };

  const onChangeVar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVars = { ...vars, [e.target.name]: parseInt(e.target.value) || 0 };
    setVars(newVars);
    setResult(calculateFormula(formula, newVars));
  };

  const onSave = () => {
    if (type === 'anime') {
      saveAnimeFormula(formula);
    } else {
      saveMangaFormula(formula);
    }

    onClose();
  };

  const [help, setHelp] = React.useState(0);

  const toggleHelp = () => {
    setHelp(help > 0 ? 0 : 1);
  };

  const nextHelp = () => {
    setHelp(help + 1);
  };

  const prevHelp = () => {
    setHelp(help - 1);
  };

  const [example, setExample] = React.useState<boolean>(false);

  const toggleExample = () => {
    setExample(!example);
  };

  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="h6">{`${toTitle(type)} Custom Tags Editor`}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tooltip
              placement={isLg ? 'bottom' : 'right'}
              arrow
              open={help === 1}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      1. Formula
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      This is where you put your score formula. This will be used to calculate the overall score of an
                      anime. You can use variable names for dynamic value. Valid variable name only contains letters and
                      underscore (_) for example <code>background_art</code>.
                    </Typography>
                    {example && (
                      <TextField
                        multiline
                        fullWidth
                        label="Example"
                        defaultValue={defaultFormula}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{ marginTop: 2, marginBottom: 2 }}
                      />
                    )}
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sx={{ paddingBottom: 0.5 }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Button onClick={toggleExample} size="small" color="warning">
                        {example ? 'Hide example' : 'Show example'}
                      </Button>
                      <Button onClick={nextHelp} size="small" color="warning">
                        Next
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              }
            >
              <TextField
                multiline
                fullWidth
                label="Formula"
                size="small"
                placeholder={defaultFormula}
                value={formula}
                onChange={onChangeFormula}
                InputProps={{
                  endAdornment: <InputAdornment position="end">= {result.toFixed(2)}</InputAdornment>,
                }}
                error={error !== ''}
                helperText={error !== '' && error}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} container spacing={1}>
            <Grid item xs={12}>
              <Tooltip
                placement={isSm ? 'top' : 'left'}
                arrow
                open={help === 2}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        2. Test the Formula
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography gutterBottom>
                        This is where you test your formula from step 1. Variables from step 1 will be listed here. You
                        can set the value for each variable and will be calculated. The result will be shown on the
                        right side in step 1.
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{ paddingBottom: 0.5 }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Button onClick={prevHelp} size="small" color="warning">
                          Back
                        </Button>
                        <Button onClick={nextHelp} size="small" color="warning">
                          Next
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                }
              >
                <Divider>Test the Formula</Divider>
              </Tooltip>
            </Grid>
            {Object.entries(vars).map((v) => {
              return (
                <Grid item xs={12} key={v[0]}>
                  <TextField
                    key={v[0]}
                    size="small"
                    fullWidth
                    disabled={error !== ''}
                    name={v[0]}
                    value={vars[v[0]]}
                    onChange={onChangeVar}
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
              );
            })}
          </Grid>
          <Grid item xs={12} sm={6} container spacing={1} direction="column">
            <Grid item xs="auto">
              <Tooltip
                placement={isSm ? 'top' : 'right'}
                arrow
                open={help === 3}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        3. Generated Tags
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography gutterBottom>
                        This is generated tags for each anime which contains variable and its value. Underscore (_) in
                        variable name will be converted to hyphen (-).
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{ paddingBottom: 0.5 }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Button onClick={prevHelp} size="small" color="warning">
                          Back
                        </Button>
                        <Button onClick={nextHelp} size="small" color="warning">
                          Next
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                }
              >
                <Divider>Tags Results</Divider>
              </Tooltip>
            </Grid>
            <Grid item xs>
              {Object.entries(vars).map((v) => {
                return (
                  <Chip
                    key={v[0]}
                    disabled={error !== ''}
                    label={`${v[0]}:${v[1]}`.replaceAll('_', '-')}
                    size="small"
                    sx={{ margin: 0.5 }}
                    color="warning"
                  />
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleHelp} color="warning">
          {help > 0 ? 'hide help' : 'show help'}
        </Button>
        <Tooltip
          placement={isSm ? 'top' : 'right'}
          arrow
          open={help === 4}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  4. Save
                </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  {`Don't forget to save the formula so you can use it later when updating your anime. Have fun.`}
                </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12} sx={{ paddingBottom: 0.5 }}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Button onClick={prevHelp} size="small" color="warning">
                    Back
                  </Button>
                  <Button onClick={toggleHelp} size="small" color="warning">
                    Done
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          }
        >
          <Button variant="contained" onClick={onSave} disabled={error !== ''} color="warning">
            Save
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

const toTitle = (type: string): string => {
  switch (type) {
    case 'anime':
      return 'Anime';
    case 'manga':
      return 'Manga';
    default:
      return '';
  }
};
