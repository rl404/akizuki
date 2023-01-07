import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchAnimeDialog from '../dialog/SearchAnimeDialog';

const AddAnimeButton = React.memo(({ username }: { username: string }) => {
  const [searchDialog, setSearchDialog] = React.useState<boolean>(false);

  const handleOpenSearchDialog = () => {
    setSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialog(false);
  };

  return (
    <>
      <Tooltip title="Add new anime" placement="top" arrow>
        <IconButton onClick={handleOpenSearchDialog}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <SearchAnimeDialog open={searchDialog} onClose={handleCloseSearchDialog} username={username} />
    </>
  );
});

export default AddAnimeButton;
