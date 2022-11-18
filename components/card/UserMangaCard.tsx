import * as React from 'react';
import { Card, CardContent, CardMedia, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { UserManga } from '../../type/Types';
import { theme } from '../theme';
import Link from 'next/link';
import { mangaTypeToStr, WEB_MAL_HOST } from '../../lib/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
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
  subtitle: {
    color: theme.palette.grey[600],
  },
};

export default function UserMangaCard({ username, userManga }: { username: string; userManga: UserManga }) {
  const [data, setData] = React.useState<UserManga>(userManga);

  React.useEffect(() => {
    setData(userManga);
  }, [userManga]);

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

  const [hoverChapter, setHoverChapter] = React.useState(false);
  const [hoverVolume, setHoverVolume] = React.useState(false);
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false);

  const onHoverChapter = () => {
    setHoverChapter(true);
  };

  const onUnhoverChapter = () => {
    setHoverChapter(false);
  };

  const setChapter = (e: number) => {
    setData((d) => {
      return { ...d, userChapter: e };
    });
  };

  const onHoverVolume = () => {
    setHoverVolume(true);
  };

  const onUnhoverVolume = () => {
    setHoverVolume(false);
  };

  const setVolume = (e: number) => {
    setData((d) => {
      return { ...d, userVolume: e };
    });
  };

  const onOpenChapterDialog = () => {
    setOpenChapterDialog(true);
  };

  const onCloseChapterDialog = () => {
    setOpenChapterDialog(false);
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

  const [openMangaDialog, setOpenMangaDialog] = React.useState(false);

  const onOpenMangaDialog = () => {
    setOpenMangaDialog(true);
  };

  const onCloseMangaDialog = () => {
    setOpenMangaDialog(false);
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
                <Link href={`${WEB_MAL_HOST}/manga/${data.id}`} target="_blank">
                  <Typography
                    variant="h6"
                    gutterBottom={data.status !== 'currently_publishing'}
                    sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {data.title}
                  </Typography>
                </Link>
              </Tooltip>
              <Divider sx={{ color: theme.palette.warning.main }}>
                {data.status === 'currently_publishing' && 'Publishing'}
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
                <span style={style.subtitle}>Type:</span> {mangaTypeToStr(data.mediaType)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              onMouseEnter={onHoverChapter}
              onMouseLeave={onUnhoverChapter}
              onClick={onOpenChapterDialog}
            >
              <Typography sx={{ cursor: 'pointer' }}>
                <span style={style.subtitle}>Chapter:</span> {data.userChapter}/{data.chapter}
                {hoverChapter && (
                  <EditIcon fontSize="inherit" sx={{ color: theme.palette.warning.main, marginLeft: 1 }} />
                )}
              </Typography>
            </Grid>
            <Grid item xs={6} onMouseEnter={onHoverVolume} onMouseLeave={onUnhoverVolume} onClick={onOpenChapterDialog}>
              <Typography sx={{ cursor: 'pointer' }}>
                <span style={style.subtitle}>Volume:</span> {data.userVolume}/{data.volume}
                {hoverVolume && (
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
              onClick={onOpenMangaDialog}
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
          type="manga"
          id={data.id}
          title={data.title}
          score={data.userScore}
          setScore={setScore}
        />
      )}
      {openChapterDialog && (
        <ChapterDialog
          open={openChapterDialog}
          onClose={onCloseChapterDialog}
          id={data.id}
          title={data.title}
          chapter={data.chapter}
          volume={data.volume}
          userChapter={data.userChapter}
          userVolume={data.userVolume}
          userStatus={data.userStatus}
          userStartDate={data.userStartDate}
          userEndDate={data.userEndDate}
          setChapter={setChapter}
          setVolume={setVolume}
          setStatus={setStatus}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
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
}
