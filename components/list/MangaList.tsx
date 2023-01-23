import { Card, CardActionArea, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { mangaTypeToStr } from '../../lib/myanimelist';
import { UserManga } from '../../type/Types';
import MangaDialog from '../dialog/MangaDialog';
import { theme } from '../theme';

const userStatusToColor = (status: string): string => {
  switch (status) {
    case 'reading':
      return theme.palette.success.main;
    case 'completed':
      return theme.palette.info.main;
    case 'on_hold':
      return theme.palette.warning.main;
    case 'dropped':
      return theme.palette.error.main;
    case 'plan_to_read':
      return theme.palette.text.primary;
    default:
      return theme.palette.background.paper;
  }
};

const MangaList = React.memo(({ username, userManga }: { username: string; userManga: UserManga }) => {
  const [data, setData] = React.useState<UserManga>(userManga);

  const [openMangaDialog, setOpenMangaDialog] = React.useState(false);

  const onOpenMangaDialog = () => {
    setOpenMangaDialog(true);
  };

  const onCloseMangaDialog = () => {
    setOpenMangaDialog(false);
  };

  return (
    <>
      <Card sx={{ borderLeft: `solid 3px ${userStatusToColor(data.userStatus)}` }}>
        <CardActionArea onClick={onOpenMangaDialog}>
          <CardContent sx={{ padding: 1, ':last-child': { paddingBottom: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <Typography sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {data.title}
                  {data.status === 'currently_publishing' && (
                    <Typography display="inline" sx={{ color: theme.palette.primary.main }}>
                      {' '}
                      — Publishing
                    </Typography>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={3} sm={2} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Type" placement="top" arrow>
                  <Typography>{mangaTypeToStr(data.mediaType)}</Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Score" placement="top" arrow>
                  <Typography>{data.userScore}</Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Chapter" placement="top" arrow>
                  <Typography>
                    {data.userChapter}/{data.chapter}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
                <Tooltip title="Volume" placement="top" arrow>
                  <Typography>
                    {data.userVolume}/{data.volume}
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
      {openMangaDialog && (
        <MangaDialog
          open={openMangaDialog}
          onClose={onCloseMangaDialog}
          username={username}
          userManga={data}
          setData={setData}
        />
      )}
    </>
  );
});

export default MangaList;
