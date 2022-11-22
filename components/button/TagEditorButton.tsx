import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import TagDialog from '../dialog/TagDialog';

const TagEditorButton = React.memo(({ username, type }: { username: string; type: string }) => {
  const [tagDialog, setTagDialog] = React.useState<boolean>(false);

  const handleOpenTagDialog = () => {
    setTagDialog(true);
  };

  const handleCloseTagDialog = () => {
    setTagDialog(false);
  };

  return (
    <>
      <Tooltip title="Tags Editor" placement="top" arrow>
        <IconButton onClick={handleOpenTagDialog}>
          <SellIcon />
        </IconButton>
      </Tooltip>
      <TagDialog open={tagDialog} onClose={handleCloseTagDialog} username={username} type={type} />
    </>
  );
});

export default TagEditorButton;
