import SearchMangaDialog from '@/src/components/dialogs/SearchMangaDialog';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

export default function AddMangaButton() {
  const [dialog, setDialog] = useState<boolean>(false);

  const openDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);

  return (
    <>
      <Tooltip title="Add New Manga" placement="top" arrow>
        <IconButton onClick={openDialog}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <SearchMangaDialog open={dialog} onClose={closeDialog} />
    </>
  );
}
