import * as React from 'react';
import { Card, CardContent, CardMedia, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { theme } from '../theme';
import { UserAnime } from '../../type/Types';
import { animeTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
import ScoreDialog from '../dialog/ScoreDialog';
import EpisodeDialog from '../dialog/EpisodeDialog';
import AnimeDialog from '../dialog/AnimeDialog';
import Link from 'next/link';

const userStatusToColor = (status: string): string => {
  switch (status) {
    case 'watching':
      return theme.palette.success.main;
    case 'completed':
      return theme.palette.info.main;
    case 'on_hold':
      return theme.palette.warning.main;
    case 'dropped':
      return theme.palette.error.main;
    case 'plan_to_watch':
      return theme.palette.text.primary;
    default:
      return theme.palette.common.black;
  }
};

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
};

export default function UserAnimeCard({ username, userAnime }: { username: string; userAnime: UserAnime }) {
  const [data, setData] = React.useState<UserAnime>(userAnime);

  React.useEffect(() => {
    setData(userAnime);
  }, [userAnime]);

  const [hoverScore, setHoverScore] = React.useState(false);
  const [openScoreDialog, setOpenScoreDialog] = React.useState(false);

  const onHoverScore = () => {
    setHoverScore(true);
  };

  const onUnhoverScore = () => {
    setHoverScore(false);
  };

  const setScore = (s: number) => {
    setData({ ...data, userScore: s });
  };

  const onOpenScoreDialog = () => {
    setOpenScoreDialog(true);
  };

  const onCloseScoreDialog = () => {
    setOpenScoreDialog(false);
  };

  const [hoverEpisode, setHoverEpisode] = React.useState(false);
  const [openEpisodeDialog, setOpenEpisodeDialog] = React.useState(false);

  const onHoverEpisode = () => {
    setHoverEpisode(true);
  };

  const onUnhoverEpisode = () => {
    setHoverEpisode(false);
  };

  const setEpisode = (e: number) => {
    setData((d) => {
      return { ...d, userEpisode: e };
    });
  };

  const onOpenEpisodeDialog = () => {
    setOpenEpisodeDialog(true);
  };

  const onCloseEpisodeDialog = () => {
    setOpenEpisodeDialog(false);
  };

  const setStatus = (s: string) => {
    setData((d) => {
      return { ...d, userStatus: s };
    });
  };

  const setStartDate = (s: string) => {
    setData((d) => {
      return { ...d, userStartDate: s };
    });
  };

  const setEndDate = (s: string) => {
    setData((d) => {
      return { ...d, userEndDate: s };
    });
  };

  const [openAnimeDialog, setOpenAnimeDialog] = React.useState(false);

  const onOpenAnimeDialog = () => {
    setOpenAnimeDialog(true);
  };

  const onCloseAnimeDialog = () => {
    setOpenAnimeDialog(false);
  };

  return (
    <>
      <Card sx={{ display: 'flex', borderRight: `solid 5px ${userStatusToColor(data.userStatus)}` }}>
        <CardMedia
          component="img"
          image={data.picture}
          alt={data.title}
          sx={{ width: 100, height: 200 }}
          loading="lazy"
        />
        <CardContent
          sx={{ position: 'relative', paddingTop: 1, width: 'calc(100% - 100px)', ':last-child': { paddingBottom: 1 } }}
        >
          <Grid container spacing={0.5}>
            <Grid item xs={12}>
              <Tooltip title={data.title}>
                <Link href={`${WEB_MAL_HOST}/anime/${data.id}`} target="_blank">
                  <Typography
                    variant="h6"
                    gutterBottom={data.status !== 'currently_airing'}
                    sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {data.title}
                  </Typography>
                </Link>
              </Tooltip>
              <Divider sx={{ color: theme.palette.warning.main }}>
                {data.status === 'currently_airing' && 'Airing'}
              </Divider>
            </Grid>
            <Grid item xs={6} onMouseEnter={onHoverScore} onMouseLeave={onUnhoverScore} onClick={onOpenScoreDialog}>
              <Typography sx={{ cursor: 'pointer' }}>
                <span style={style.subtitle}>Score:</span> {data.userScore}
                {hoverScore && (
                  <EditIcon fontSize="inherit" sx={{ color: theme.palette.warning.main, marginLeft: 1 }} />
                )}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <span style={style.subtitle}>Type:</span> {animeTypeToStr(data.mediaType)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              onMouseEnter={onHoverEpisode}
              onMouseLeave={onUnhoverEpisode}
              onClick={onOpenEpisodeDialog}
            >
              <Typography sx={{ cursor: 'pointer' }}>
                <span style={style.subtitle}>Episode:</span> {data.userEpisode}/{data.episode}
                {hoverEpisode && (
                  <EditIcon fontSize="inherit" sx={{ color: theme.palette.warning.main, marginLeft: 1 }} />
                )}
              </Typography>
            </Grid>
          </Grid>
          <Tooltip title="edit" placement="left" arrow>
            <IconButton
              sx={{ position: 'absolute', right: 5, bottom: 5 }}
              color="warning"
              size="small"
              onClick={onOpenAnimeDialog}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardContent>
      </Card>
      {openScoreDialog && (
        <ScoreDialog
          open={openScoreDialog}
          onClose={onCloseScoreDialog}
          type="anime"
          id={data.id}
          title={data.title}
          score={data.userScore}
          setScore={setScore}
        />
      )}
      {openEpisodeDialog && (
        <EpisodeDialog
          open={openEpisodeDialog}
          onClose={onCloseEpisodeDialog}
          id={data.id}
          title={data.title}
          episode={data.episode}
          userEpisode={data.userEpisode}
          userStatus={data.userStatus}
          userStartDate={data.userStartDate}
          userEndDate={data.userEndDate}
          setEpisode={setEpisode}
          setStatus={setStatus}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}
      {openAnimeDialog && (
        <AnimeDialog
          open={openAnimeDialog}
          onClose={onCloseAnimeDialog}
          username={username}
          userAnime={data}
          setData={setData}
        />
      )}
    </>
  );
}
