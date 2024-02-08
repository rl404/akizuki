import EpisodeDialog from '@/src/components/dialogs/EpisodeDialog';
import ScoreDialog from '@/src/components/dialogs/ScoreDialog';
import UserAnimeDialog from '@/src/components/dialogs/UserAnimeDialog';
import theme from '@/src/components/theme';
import { UserAnime } from '@/src/types';
import { AnimeTypeStr, UserStatusColor } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, CardMedia, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
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

export default function UserAnimeCard({ userAnime, nsfw }: { userAnime: UserAnime; nsfw: boolean }) {
  const [data, setData] = useState<UserAnime>(userAnime);
  const [scoreDialog, setScoreDialog] = useState<boolean>(false);
  const [episodeDialog, setEpisodeDialog] = useState<boolean>(false);
  const [animeDialog, setAnimeDialog] = useState<boolean>(false);

  useEffect(() => {
    setData(userAnime);
  }, [userAnime]);

  const openScoreDialog = () => setScoreDialog(true);
  const closeScoreDialog = () => setScoreDialog(false);
  const openEpisodeDialog = () => setEpisodeDialog(true);
  const closeEpisodeDialog = () => setEpisodeDialog(false);
  const openAnimeDialog = () => setAnimeDialog(true);
  const closeAnimeDialog = () => setAnimeDialog(false);

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
            <Grid item xs={12}>
              <Tooltip title={data.title}>
                <Link href={`${MAL_WEB_HOST}/anime/${data.id}`} target="_blank">
                  <Typography
                    variant="h6"
                    gutterBottom={data.status !== 'currently_airing'}
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
                {data.status === 'currently_airing' && 'Airing'}
              </Divider>
            </Grid>
            <Grid item xs={6} onClick={openScoreDialog}>
              <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                <span style={style.subtitle}>Score:</span> {data.userScore}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <span style={style.subtitle}>Type:</span> {AnimeTypeStr(data.mediaType)}
              </Typography>
            </Grid>
            <Grid item xs={12} onClick={openEpisodeDialog}>
              <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                <span style={style.subtitle}>Episode:</span> {data.userEpisode}/{data.episode}
              </Typography>
            </Grid>
          </Grid>
          <Tooltip title="Edit" placement="left" arrow>
            <IconButton
              sx={{ position: 'absolute', right: 5, bottom: 5 }}
              color="primary"
              size="small"
              onClick={openAnimeDialog}
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
        type="anime"
        setData={(d) => setData(d as UserAnime)}
      />
      <EpisodeDialog open={episodeDialog} onClose={closeEpisodeDialog} data={data} setData={setData} />
      <UserAnimeDialog open={animeDialog} onClose={closeAnimeDialog} data={data} setData={setData} />
    </>
  );
}
