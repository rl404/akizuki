import { Card, CardActionArea, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { animeTypeToStr } from '../../lib/myanimelist';
import { UserAnime } from '../../type/Types';
import AnimeDialog from '../dialog/AnimeDialog';
import { theme } from '../theme';

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
      return theme.palette.background.paper;
  }
};

const AnimeList = React.memo(({ username, userAnime }: { username: string; userAnime: UserAnime }) => {
  const [data, setData] = React.useState<UserAnime>(userAnime);

  const [openAnimeDialog, setOpenAnimeDialog] = React.useState(false);

  const onOpenAnimeDialog = () => {
    setOpenAnimeDialog(true);
  };

  const onCloseAnimeDialog = () => {
    setOpenAnimeDialog(false);
  };

  return (
    <>
      <Card sx={{ borderLeft: `solid 3px ${userStatusToColor(data.userStatus)}` }}>
        <CardActionArea onClick={onOpenAnimeDialog}>
          <CardContent sx={{ padding: 1, ':last-child': { paddingBottom: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Typography sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {data.title}
                  {data.status === 'currently_airing' && (
                    <Typography display="inline" sx={{ color: theme.palette.primary.main }}>
                      {' '}
                      — Airing
                    </Typography>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Type" placement="top" arrow>
                  <Typography>{animeTypeToStr(data.mediaType)}</Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={4} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Score" placement="top" arrow>
                  <Typography>{data.userScore}</Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={4} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Episode" placement="top" arrow>
                  <Typography>
                    {data.userEpisode}/{data.episode}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
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

export default AnimeList;
