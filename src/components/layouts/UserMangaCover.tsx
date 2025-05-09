import UserMangaDialog from '@/src/components/dialogs/UserMangaDialog';
import theme from '@/src/components/theme';
import { UserManga } from '@/src/types';
import { MangaTypeStr, UserStatusColor } from '@/src/utils/const';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

const style = {
  titleArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 1,
    paddingTop: 0.5,
    paddingBottom: 0.5,
    background: theme.palette.background.paper,
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    '&:hover': {
      whiteSpace: 'normal',
    },
  },
  airing: {
    color: theme.palette.primary.main,
  },
  typeArea: {
    position: 'absolute',
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

export default function UserMangaCover({ userManga, nsfw }: { userManga: UserManga; nsfw: boolean }) {
  const [data, setData] = useState<UserManga>(userManga);
  const [dialog, setDialog] = useState<boolean>(false);

  useEffect(() => {
    setData(userManga);
  }, [userManga]);

  const openDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);

  return (
    <>
      <Card>
        <CardActionArea onClick={openDialog}>
          <CardMedia
            component="img"
            image={data.picture}
            alt={data.title}
            sx={{
              aspectRatio: 7 / 10,
              filter: !nsfw && data.nsfw ? 'blur(5px)' : '',
              opacity: !nsfw && data.nsfw ? 0.5 : 1,
            }}
            loading="lazy"
          />
          <CardContent sx={style.typeArea}>
            <Chip label={MangaTypeStr(data.mediaType)} size="small" color="primary" sx={{ display: 'none' }} />
          </CardContent>
          <CardContent sx={{ ...style.titleArea, borderBottom: `solid 3px ${UserStatusColor(data.userStatus)}` }}>
            {data.status === 'currently_publishing' && <Divider sx={style.airing}>Publishing</Divider>}
            <Typography sx={style.title}>{data.title}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <UserMangaDialog open={dialog} onClose={closeDialog} data={data} setData={setData} />
    </>
  );
}
