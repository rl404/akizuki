import ScoreDialog from '@/src/components/dialogs/ScoreDialog';
import UserMangaDialog from '@/src/components/dialogs/UserMangaDialog';
import theme from '@/src/components/theme';
import { UserManga } from '@/src/types';
import { MangaTypeStr, UserStatusColor } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ChapterDialog from '../dialogs/ChapterDialog';

const style = {
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
};

export default function UserMangaList({ userManga }: { userManga: UserManga }) {
  const [data, setData] = useState<UserManga>(userManga);
  const [scoreDialog, setScoreDialog] = useState<boolean>(false);
  const [chapterDialog, setChapterDialog] = useState<boolean>(false);
  const [animeDialog, setMangaDialog] = useState<boolean>(false);

  useEffect(() => {
    setData(userManga);
  }, [userManga]);

  const openScoreDialog = () => setScoreDialog(true);
  const closeScoreDialog = () => setScoreDialog(false);
  const openChapterDialog = () => setChapterDialog(true);
  const closeChapterDialog = () => setChapterDialog(false);
  const openMangaDialog = () => setMangaDialog(true);
  const closeMangaDialog = () => setMangaDialog(false);

  return (
    <>
      <Card sx={{ borderLeft: `solid 5px ${UserStatusColor(data.userStatus)}` }}>
        <CardContent sx={{ p: 0.5, pl: 2, pr: 2, ':last-child': { paddingBottom: 0.5 } }}>
          <Grid container spacing={0.5} alignItems="center">
            <Grid item xs={12} sm={7}>
              <Link href={`${MAL_WEB_HOST}/manga/${data.id}`} target="_blank">
                <Typography
                  variant="h6"
                  sx={{ ...style.link, overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {data.title}
                  {data.status === 'currently_publishing' && (
                    <Typography display="inline" sx={{ color: theme.palette.primary.main }}>
                      {' '}
                      — Publishing
                    </Typography>
                  )}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs sm={1} textAlign="center">
              <Tooltip title="Type" placement="top" arrow>
                <Typography>{MangaTypeStr(data.mediaType)}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs sm={1} textAlign="center" onClick={openScoreDialog}>
              <Tooltip title="Score" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>{data.userScore}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs sm={1} textAlign="center" onClick={openChapterDialog}>
              <Tooltip title="Chapter" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userChapter}/{data.chapter}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs sm={1} textAlign="center" onClick={openChapterDialog}>
              <Tooltip title="Volume" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userVolume}/{data.volume}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs sm={1} textAlign="center">
              <Tooltip title="Edit" placement="right" arrow>
                <IconButton size="small" color="primary" onClick={openMangaDialog}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ScoreDialog
        open={scoreDialog}
        onClose={closeScoreDialog}
        data={data}
        type="manga"
        setData={(d) => setData(d as UserManga)}
      />
      <ChapterDialog open={chapterDialog} onClose={closeChapterDialog} data={data} setData={setData} />
      <UserMangaDialog open={animeDialog} onClose={closeMangaDialog} data={data} setData={setData} />
    </>
  );
}
