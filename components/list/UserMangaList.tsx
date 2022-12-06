import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { theme } from '../theme';
import { UserManga } from '../../type/Types';
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { mangaTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import Link from 'next/link';
import ScoreDialog from '../dialog/ScoreDialog';
import ChapterDialog from '../dialog/ChapterDialog';
import MangaDialog from '../dialog/MangaDialog';

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
      return theme.palette.common.black;
  }
};

const style = {
  link: {
    '&:hover': {
      color: theme.palette.warning.main,
    },
  },
};

const UserMangaList = React.memo(({ username, userManga }: { username: string; userManga: UserManga }) => {
  const [data, setData] = React.useState<UserManga>(userManga);

  React.useEffect(() => {
    setData(userManga);
  }, [userManga]);

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

  const [openChapterDialog, setOpenChapterDialog] = React.useState(false);

  const onOpenChapterDialog = () => {
    setOpenChapterDialog(true);
  };

  const onCloseChapterDialog = () => {
    setOpenChapterDialog(false);
  };

  const [openMangaDialog, setOpenMangaDialog] = React.useState(false);

  const onOpenMangaDialog = () => {
    setOpenMangaDialog(true);
  };

  const onCloseMangaDialog = () => {
    setOpenMangaDialog(false);
  };

  return (
    <>
      <Card sx={{ borderLeft: `solid 5px ${userStatusToColor(data.userStatus)}` }}>
        <CardContent sx={{ ':last-child': { paddingBottom: 2 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Link href={`${WEB_MAL_HOST}/manga/${data.id}`} target="_blank">
                <Typography
                  variant="h6"
                  sx={{ ...style.link, overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {data.title}
                  {data.status === 'currently_publishing' && (
                    <Typography display="inline" sx={{ color: theme.palette.warning.main }}>
                      {' '}
                      — Publishing
                    </Typography>
                  )}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
              <Tooltip title="Type" placement="top" arrow>
                <Typography>{mangaTypeToStr(data.mediaType)}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={onOpenScoreDialog} sx={{ margin: 'auto' }}>
              <Tooltip title="Score" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>{data.userScore}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={onOpenChapterDialog} sx={{ margin: 'auto' }}>
              <Tooltip title="Chapter" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userChapter}/{data.chapter}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={onOpenChapterDialog} sx={{ margin: 'auto' }}>
              <Tooltip title="Volume" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userVolume}/{data.volume}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" sx={{ margin: 'auto' }}>
              <Tooltip title="edit" placement="right" arrow>
                <IconButton size="small" color="warning" onClick={onOpenMangaDialog}>
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
          type="manga"
          id={data.id}
          title={data.title}
          score={data.userScore}
          setScore={setScore}
        />
      )}
      {openChapterDialog && (
        <ChapterDialog open={openChapterDialog} onClose={onCloseChapterDialog} userManga={data} setData={setData} />
      )}
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

export default UserMangaList;
