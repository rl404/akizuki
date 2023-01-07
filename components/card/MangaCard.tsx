import { Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { UserManga } from '../../type/Types';
import MangaDialog from '../dialog/MangaDialog';
import { theme } from '../theme';
import { mangaTypeToStr } from '../../lib/myanimelist';

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
    color: theme.palette.warning.main,
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

const MangaCard = React.memo(({ username, userManga }: { username: string; userManga: UserManga }) => {
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
      <Card>
        <CardActionArea onClick={onOpenMangaDialog}>
          <CardMedia component="img" image={data.picture} alt={data.title} sx={{ height: 200 }} loading="lazy" />
          <CardContent sx={style.typeArea}>
            <Chip label={mangaTypeToStr(data.mediaType)} size="small" color="warning" sx={{ display: 'none' }} />
          </CardContent>
          <CardContent sx={{ ...style.titleArea, borderBottom: `solid 3px ${userStatusToColor(data.userStatus)}` }}>
            {data.status === 'currently_publishing' && <Divider sx={style.airing}>Publishing</Divider>}
            <Typography sx={style.title}>{data.title}</Typography>
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

export default MangaCard;
