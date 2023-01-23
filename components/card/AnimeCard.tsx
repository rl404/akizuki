import { Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { UserAnime } from '../../type/Types';
import AnimeDialog from '../dialog/AnimeDialog';
import { theme } from '../theme';
import { animeTypeToStr } from '../../lib/myanimelist';

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

const style = {
  titleArea: {
    position: 'absolute' as 'absolute',
    bottom: 0,
    width: '100%',
    padding: 1,
    paddingTop: 0.5,
    paddingBottom: 0.5,
    background: theme.palette.background.paper,
  },
  title: {
    whiteSpace: 'nowrap' as 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      whiteSpace: 'normal',
    },
  },
  airing: {
    color: theme.palette.primary.main,
  },
  typeArea: {
    position: 'absolute' as 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    padding: 0.5,
    textAlign: 'right',
    '&:hover': {
      '.MuiChip-root': {
        display: 'inline-flex',
      },
    },
  },
};

const AnimeCard = React.memo(
  ({ username, userAnime, nsfw }: { username: string; userAnime: UserAnime; nsfw: boolean }) => {
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
        <Card>
          <CardActionArea onClick={onOpenAnimeDialog}>
            <CardMedia
              component="img"
              image={data.picture}
              alt={data.title}
              sx={{ height: 200, filter: !nsfw && data.nsfw ? 'blur(5px)' : '', opacity: !nsfw && data.nsfw ? 0.5 : 1 }}
              loading="lazy"
            />
            <CardContent sx={style.typeArea}>
              <Chip label={animeTypeToStr(data.mediaType)} size="small" color="primary" sx={{ display: 'none' }} />
            </CardContent>
            <CardContent sx={{ ...style.titleArea, borderBottom: `solid 3px ${userStatusToColor(data.userStatus)}` }}>
              {data.status === 'currently_airing' && <Divider sx={style.airing}>Airing</Divider>}
              <Typography sx={style.title}>{data.title}</Typography>
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
  },
);

export default AnimeCard;
