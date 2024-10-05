import ChapterDialog from '@/src/components/dialogs/ChapterDialog';
import ScoreDialog from '@/src/components/dialogs/ScoreDialog';
import UserMangaDialog from '@/src/components/dialogs/UserMangaDialog';
import theme from '@/src/components/theme';
import { UserManga } from '@/src/types';
import { MangaTypeStr, UserStatusColor } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const style = {
  subtitle: {
    color: theme.palette.grey[600],
  },
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
};

export default function UserMangaCard({ userManga, nsfw }: { userManga: UserManga; nsfw: boolean }) {
  const [data, setData] = useState<UserManga>(userManga);
  const [scoreDialog, setScoreDialog] = useState<boolean>(false);
  const [chapterDialog, setChapterDialog] = useState<boolean>(false);
  const [mangaDialog, setMangaDialog] = useState<boolean>(false);

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
      <Card
        sx={{
          display: 'flex',
          borderRight: `solid 5px ${UserStatusColor(data.userStatus)}`,
        }}
      >
        <CardMedia
          component="img"
          image={data.picture}
          alt={data.title}
          sx={{
            width: 100,
            height: 200,
            filter: !nsfw && data.nsfw ? 'blur(5px)' : '',
            opacity: !nsfw && data.nsfw ? 0.5 : 1,
          }}
        />
        <CardContent
          sx={{
            position: 'relative',
            paddingTop: 1,
            width: 'calc(100% - 100px)',
          }}
        >
          <Grid container spacing={0.5}>
            <Grid size={12}>
              <Tooltip title={data.title}>
                <Link href={`${MAL_WEB_HOST}/manga/${data.id}`} target="_blank">
                  <Typography
                    variant="h6"
                    gutterBottom={data.status !== 'currently_publishing'}
                    sx={{
                      ...style.link,
                      overflowX: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {data.title}
                  </Typography>
                </Link>
              </Tooltip>
              <Divider sx={{ color: theme.palette.primary.main }}>
                {data.status === 'currently_publishing' && 'Publishing'}
              </Divider>
            </Grid>
            <Grid size={6} onClick={openScoreDialog}>
              <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                <span style={style.subtitle}>Score:</span> {data.userScore}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography>
                <span style={style.subtitle}>Type:</span> {MangaTypeStr(data.mediaType)}
              </Typography>
            </Grid>
            <Grid size={6} onClick={openChapterDialog}>
              <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                <span style={style.subtitle}>Chapter:</span> {data.userChapter}/{data.chapter}
              </Typography>
            </Grid>
            <Grid size={6} onClick={openChapterDialog}>
              <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                <span style={style.subtitle}>Volume:</span> {data.userVolume}/{data.volume}
              </Typography>
            </Grid>
          </Grid>
          <Tooltip title="Edit" placement="left" arrow>
            <IconButton
              sx={{ position: 'absolute', right: 5, bottom: 5 }}
              color="primary"
              size="small"
              onClick={openMangaDialog}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
      <UserMangaDialog open={mangaDialog} onClose={closeMangaDialog} data={data} setData={setData} />
    </>
  );
}
