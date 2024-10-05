import TagEditorDialog from '@/src/components/dialogs/TagEditorDialog';
import { MediaType } from '@/src/types';
import SellIcon from '@mui/icons-material/Sell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

export default function TagEditorButton({ type }: { type: MediaType }) {
  const [open, setOpen] = useState<boolean>(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <Tooltip title="Tags Editor" placement="top" arrow>
        <IconButton onClick={openDialog}>
          <SellIcon />
        </IconButton>
      </Tooltip>
      <TagEditorDialog open={open} onClose={closeDialog} type={type} />
    </>
  );
}
