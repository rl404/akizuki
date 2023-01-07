import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchMangaDialog from '../dialog/SearchMangaDialog';

const AddMangaButton = React.memo(({ username }: { username: string }) => {
  const [searchDialog, setSearchDialog] = React.useState<boolean>(false);

  const handleOpenSearchDialog = () => {
    setSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialog(false);
  };

  return (
    <>
      <Tooltip title="Add new manga" placement="top" arrow>
        <IconButton onClick={handleOpenSearchDialog}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <SearchMangaDialog open={searchDialog} onClose={handleCloseSearchDialog} username={username} />
    </>
  );
});

export default AddMangaButton;
