import { Box, Button } from '@mui/material';
import { AppDialog } from './AppDialog';

type Props = {
  open: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
};

/** Vista previa embebida de un PDF (object URL). No descarga el archivo. */
export const PdfPreviewDialog = ({
  open,
  url,
  title = 'Vista previa',
  onClose,
}: Props) => {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow="PDF"
      title={title}
      subtitle="Solo vista previa — no se descarga ningún archivo."
      maxWidth="lg"
      scrollable={false}
      actions={
        <Button variant="contained" size="large" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <Box
        sx={{
          height: { xs: '60vh', md: '72vh' },
          bgcolor: '#525659',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {url ? (
          <Box
            component="iframe"
            title={title}
            src={url}
            sx={{ width: '100%', height: '100%', border: 0 }}
          />
        ) : null}
      </Box>
    </AppDialog>
  );
};
