import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Tooltip, Zoom } from '@mui/material';
import { useEffect, useState } from 'react';

const style = {
  position: 'fixed',
  bottom: 16,
  right: 16,
};

export default function ScrollToTop() {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setShow(window.scrollY > 200));
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  return (
    <Zoom in={show}>
      <Tooltip title="Scroll to Top" placement="left" arrow>
        <Fab sx={style} onClick={scrollToTop} color="primary" size="small">
          <UpIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
