import { UserManga } from '@/src/types';
import { akizukiAxios } from '@/src/utils/axios';
import { getAxiosError } from '@/src/utils/utils';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function ChapterDialog({
  open,
  onClose,
  data,
  setData,
}: {
  open: boolean;
  onClose: () => void;
  data: UserManga;
  setData: (data: UserManga) => void;
}) {
  const [newChapter, setNewChapter] = useState<number>(data.userChapter);
  const [newVolume, setNewVolume] = useState<number>(data.userVolume);
  const [completed, setCompleted] = useState<boolean>(false);
  const [reading, setReading] = useState<boolean>(false);
  const [todayStart, setTodayStart] = useState<boolean>(false);
  const [todayEnd, setTodayEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewChapter(parseInt(e.target.value, 10) || 0);
  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewVolume(parseInt(e.target.value, 10) || 0);

  const increaseChapter = () => setNewChapter(newChapter + 1);
  const decreaseChapter = () => setNewChapter(newChapter - 1);
  const increaseVolume = () => setNewVolume(newVolume + 1);
  const decreaseVolume = () => setNewVolume(newVolume - 1);

  const toggleCompleted = () => {
    setReading(false);
    setCompleted(!completed);
  };

  const toggleReading = () => {
    setCompleted(false);
    setReading(!reading);
  };

  const toggleTodayStart = () => setTodayStart(!todayStart);
  const toggleTodayEnd = () => setTodayEnd(!todayEnd);

  const onUpdate = () => {
    setError('');
    setLoading(true);

    akizukiAxios
      .put(`/api/mal/usermanga/chapter`, {
        id: data.id,
        chapter: newChapter,
        volume: newVolume,
        reading: reading,
        completed: completed,
        todayStart: todayStart,
        todayEnd: todayEnd,
      })
      .then(() => {
        const today = new Date();

        setData({
          ...data,
          userChapter: newChapter,
          userVolume: newVolume,
          userStatus: completed ? 'completed' : reading ? 'reading' : data.userStatus,
          userStartDate: todayStart ? today.toISOString().slice(0, 10) : data.userStartDate,
          userEndDate: todayEnd ? today.toISOString().slice(0, 10) : data.userEndDate,
        });

        onClose();
      })
      .catch((err) => setError(getAxiosError(err)))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{`${data.title}'s Chapter`}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
          <TextField
            label="Chapter"
            value={newChapter}
            size="small"
            onChange={onChapterChange}
            sx={{ width: 150 }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${data.chapter}`}</InputAdornment>,
            }}
          />
          <IconButton size="small" onClick={decreaseChapter} disabled={newChapter <= 0}>
            <RemoveIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={increaseChapter}
            disabled={data.chapter !== 0 && newChapter >= data.chapter}
          >
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <TextField
            label="Volume"
            value={newVolume}
            size="small"
            onChange={onVolumeChange}
            sx={{ width: 150 }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{`/ ${data.volume}`}</InputAdornment>,
            }}
          />
          <IconButton size="small" onClick={decreaseVolume} disabled={newVolume <= 0}>
            <RemoveIcon />
          </IconButton>
          <IconButton size="small" onClick={increaseVolume} disabled={data.volume !== 0 && newVolume >= data.volume}>
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack>
          {data.userStatus !== 'completed' && data.volume > 0 && newVolume === data.volume && (
            <>
              <FormControlLabel
                label="Set status as Completed"
                control={<Checkbox size="small" checked={completed} onChange={toggleCompleted} />}
              />
              {data.userStartDate === '' && (
                <FormControlLabel
                  label="Set today as start date"
                  control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                />
              )}
              {data.userEndDate === '' && (
                <FormControlLabel
                  label="Set today as finish date"
                  control={<Checkbox size="small" checked={todayEnd} onChange={toggleTodayEnd} />}
                />
              )}
            </>
          )}
          {data.userStatus !== 'reading' &&
            newChapter > 0 &&
            newChapter !== data.userChapter &&
            newChapter !== data.chapter && (
              <>
                <FormControlLabel
                  label="Set status as Reading"
                  control={<Checkbox size="small" checked={reading} onChange={toggleReading} />}
                />
                {data.userStartDate === '' && (
                  <FormControlLabel
                    label="Set today as start date"
                    control={<Checkbox size="small" checked={todayStart} onChange={toggleTodayStart} />}
                  />
                )}
              </>
            )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {error && (
          <Typography color="error" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        <LoadingButton variant="contained" loading={loading} onClick={onUpdate}>
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
