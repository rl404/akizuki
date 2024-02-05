import EpisodeDialog from '@/src/components/dialogs/EpisodeDialog';
import ScoreDialog from '@/src/components/dialogs/ScoreDialog';
import UserAnimeDialog from '@/src/components/dialogs/UserAnimeDialog';
import theme from '@/src/components/theme';
import { UserAnime } from '@/src/types';
import { AnimeTypeStr, UserStatusColor } from '@/src/utils/const';
import { MAL_WEB_HOST } from '@/src/utils/myanimelist';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

const style = {
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
};

export default function UserAnimeList({ userAnime }: { userAnime: UserAnime }) {
  const [data, setData] = useState<UserAnime>(userAnime);
  const [scoreDialog, setScoreDialog] = useState<boolean>(false);
  const [episodeDialog, setEpisodeDialog] = useState<boolean>(false);
  const [animeDialog, setAnimeDialog] = useState<boolean>(false);

  const openScoreDialog = () => setScoreDialog(true);
  const closeScoreDialog = () => setScoreDialog(false);
  const openEpisodeDialog = () => setEpisodeDialog(true);
  const closeEpisodeDialog = () => setEpisodeDialog(false);
  const openAnimeDialog = () => setAnimeDialog(true);
  const closeAnimeDialog = () => setAnimeDialog(false);

  return (
    <>
      <Card sx={{ borderLeft: `solid 5px ${UserStatusColor(data.userStatus)}` }}>
        <CardContent sx={{ p: 0.5, pl: 2, pr: 2, ':last-child': { paddingBottom: 0.5 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Link href={`${MAL_WEB_HOST}/anime/${data.id}`} target="_blank">
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
            <Grid item xs={3} sm={1} textAlign="center">
              <Tooltip title="Type" placement="top" arrow>
                <Typography>{AnimeTypeStr(data.mediaType)}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={openScoreDialog}>
              <Tooltip title="Score" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>{data.userScore}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center" onClick={openEpisodeDialog}>
              <Tooltip title="Episode" placement="top" arrow>
                <Typography sx={{ ...style.link, cursor: 'pointer' }}>
                  {data.userEpisode}/{data.episode}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={3} sm={1} textAlign="center">
              <Tooltip title="Edit" placement="right" arrow>
                <IconButton size="small" color="primary" onClick={openAnimeDialog}>
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
        type="anime"
        setData={(d) => setData(d as UserAnime)}
      />
      <EpisodeDialog open={episodeDialog} onClose={closeEpisodeDialog} data={data} setData={setData} />
      <UserAnimeDialog open={animeDialog} onClose={closeAnimeDialog} data={data} setData={setData} />
    </>
  );
}
