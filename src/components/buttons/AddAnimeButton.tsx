import SearchAnimeDialog from '@/src/components/dialogs/SearchAnimeDialog';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

export default function AddAnimeButton() {
  const [dialog, setDialog] = useState<boolean>(false);

  const openDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);

  return (
    <>
      <Tooltip title="Add New Anime" placement="top" arrow>
        <IconButton onClick={openDialog}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <SearchAnimeDialog open={dialog} onClose={closeDialog} />
    </>
  );
}
