import theme from '@/src/components/theme';
import { MediaType } from '@/src/types';
import { MediaTypeStr } from '@/src/utils/const';
import {
  DefaultFormula,
  calculateFormula,
  extractVarFromFormula,
  getUserFormula,
  isFormulaValid,
  saveUserFormula,
} from '@/src/utils/formula';
import { getUser } from '@/src/utils/user';
import { getAxiosError } from '@/src/utils/utils';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TagEditorDialog({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: MediaType;
}) {
  const [formula, setFormula] = useState<string>('');
  const [vars, setVars] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<number>(0);
  const [help, setHelp] = useState<number>(0);
  const [example, setExample] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    axios
      .get(`/api/firebase/formula/${user.username}/${type}`)
      .then((resp) => {
        setFormula(resp.data);
        saveUserFormula(type, resp.data);
      })
      .catch((error) => {
        setFormula(getUserFormula(type));
        console.log(getAxiosError(error));
      })
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    setVars(extractVarFromFormula(formula).reduce((res, v) => ({ ...res, [v]: 0 }), {}));
  }, [formula]);

  useEffect(() => {
    setResult(calculateFormula(formula, vars) || 0);
  }, [formula, vars]);

  const toggleHelp = () => setHelp(help > 0 ? 0 : 1);
  const nextHelp = () => setHelp(help + 1);
  const prevHelp = () => setHelp(help - 1);
  const toggleExample = () => setExample(!example);

  const onChangeFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormula(e.target.value);
    if (!isFormulaValid(e.target.value)) {
      setError('invalid formula');
    } else {
      setError('');
    }
  };

  const onChangeVar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVars = { ...vars, [e.target.name]: parseInt(e.target.value) || 0 };
    setVars(newVars);
  };

  const onSave = () => {
    const user = getUser();
    if (!user) return;

    setError('');
    setLoading(true);

    axios
      .post(`/api/firebase/formula/${user.username}/${type}`, {
        formula: formula,
      })
      .then(() => saveUserFormula(type, formula))
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="h6">{`${MediaTypeStr(type)} Custom Tags Editor`}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Tooltip
              placement={isLg ? 'bottom' : 'right'}
              arrow
              open={help === 1}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
                <Grid container spacing={1}>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      1. Formula
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
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
                        defaultValue={DefaultFormula}
                        sx={{ marginTop: 2, marginBottom: 2 }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )}
                    <Divider />
                  </Grid>
                  <Grid size={12} sx={{ paddingBottom: 0.5 }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Button onClick={toggleExample} size="small">
                        {example ? 'Hide example' : 'Show example'}
                      </Button>
                      <Button onClick={nextHelp} size="small">
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
                placeholder={DefaultFormula}
                value={formula}
                onChange={onChangeFormula}
                disabled={loading}
                InputProps={{
                  endAdornment: <InputAdornment position="end">= {result.toFixed(2)}</InputAdornment>,
                }}
                error={error !== ''}
                helperText={error !== '' && error}
              />
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} container spacing={1}>
            <Grid size={12}>
              <Tooltip
                placement={isSm ? 'top' : 'left'}
                arrow
                open={help === 2}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <Typography variant="h6" gutterBottom>
                        2. Test the Formula
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom>
                        This is where you test your formula from step 1. Variables from step 1 will be listed here. You
                        can set the value for each variable and will be calculated. The result will be shown on the
                        right side in step 1.
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={12} sx={{ paddingBottom: 0.5 }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Button onClick={prevHelp} size="small">
                          Back
                        </Button>
                        <Button onClick={nextHelp} size="small">
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
            {Object.entries(vars).map((v) => (
              <Grid size={12} key={v[0]}>
                <TextField
                  key={v[0]}
                  size="small"
                  fullWidth
                  disabled={loading || error !== ''}
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
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} container spacing={1} direction="column">
            <Grid size="auto">
              <Tooltip
                placement={isSm ? 'top' : 'right'}
                arrow
                open={help === 3}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <Typography variant="h6" gutterBottom>
                        3. Generated Tags
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom>
                        This is generated tags for each anime which contains variable and its value. Underscore (_) in
                        variable name will be converted to hyphen (-).
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={12} sx={{ paddingBottom: 0.5 }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Button onClick={prevHelp} size="small">
                          Back
                        </Button>
                        <Button onClick={nextHelp} size="small">
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
            <Grid size="grow">
              {Object.entries(vars).map((v) => (
                <Chip
                  key={v[0]}
                  disabled={loading || error !== ''}
                  label={`${v[0]}:${v[1]}`.replaceAll('_', '-')}
                  size="small"
                  sx={{ margin: 0.5 }}
                  color="primary"
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleHelp}>{help > 0 ? 'hide help' : 'show help'}</Button>
        <Tooltip
          placement={isSm ? 'top' : 'right'}
          arrow
          open={help === 4}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={
            <Grid container spacing={1}>
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  4. Save
                </Typography>
                <Divider />
              </Grid>
              <Grid size={12}>
                <Typography gutterBottom>
                  {`Don't forget to save the formula so you can use it later when updating your anime. Have fun.`}
                </Typography>
                <Divider />
              </Grid>
              <Grid size={12} sx={{ paddingBottom: 0.5 }}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Button onClick={prevHelp} size="small">
                    Back
                  </Button>
                  <Button onClick={toggleHelp} size="small">
                    Done
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          }
        >
          <LoadingButton variant="contained" onClick={onSave} loading={loading} disabled={error !== ''}>
            Save
          </LoadingButton>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
