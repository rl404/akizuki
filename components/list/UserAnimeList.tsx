import * as React from 'react';
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { animeTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import { UserAnime } from '../../type/Types';
import { theme } from '../theme';
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
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
};

const UserAnimeList = React.memo(({ username, userAnime }: { username: string; userAnime: UserAnime }) => {
  const [data, setData] = React.useState<UserAnime>(userAnime);

  React.useEffect(() => {
    setData(userAnime);
  }, [userAnime]);

  const [openScoreDialog, setOpenScoreDialog] = React.useState(false);

  const setScore = (s: number) => {
    setData({ ...data, userScore: s });
  };

  const onOpenScoreDialog = () => {
    setOpenScoreDialog(true);
  };

  const onCloseScoreDialog = () => {
    setOpenScoreDialog(false);
  };

  const [openEpisodeDialog, setOpenEpisodeDialog] = React.useState(false);

  const onOpenEpisodeDialog = () => {
    setOpenEpisodeDialog(true);
  };

  const onCloseEpisodeDialog = () => {
    setOpenEpisodeDialog(false);
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
      <Card sx={{ borderLeft: `solid 5px ${userStatusToColor(data.userStatus)}` }}>
        <CardContent sx={{ ':last-child': { paddingBottom: 2 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Link href={`${WEB_MAL_HOST}/anime/${data.id}`} target="_blank">
                <Typography
                  variant="h6"
                  sx={{ ...style.link, overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {data.title}
                  {data.status === 'currently_airing' && (
                    <Typography display="inline" sx={{ color: theme.palette.primary.main }}>
                      {' '}
                      — Airing
                    </Typography>
                  )}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
              <Tooltip title="Type" placement="top" arrow>
                <Typography>{animeTypeToStr(data.mediaType)}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={onOpenScoreDialog} sx={{ margin: 'auto' }}>
              <Tooltip title="Score" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>{data.userScore}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={onOpenEpisodeDialog} sx={{ margin: 'auto' }}>
              <Tooltip title="Episode" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userEpisode}/{data.episode}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
              <Tooltip title="edit" placement="right" arrow>
                <IconButton size="small" color="primary" onClick={onOpenAnimeDialog}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
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
        <EpisodeDialog open={openEpisodeDialog} onClose={onCloseEpisodeDialog} userAnime={data} setData={setData} />
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
});

export default UserAnimeList;
