import { Box, Button, Stack, Typography, alpha } from '@mui/material';
import { AppDialog } from '../dialogs/AppDialog';

interface IProps {
  onClose: () => void;
  open: boolean;
  data: string[];
}

export const ViewAuditoria = ({ onClose, open, data }: IProps) => {
  const entries = (data || []).map((line) => line.trim()).filter(Boolean);

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow="Cliente"
      title="Historial"
      subtitle="Cambios y movimientos registrados para este vecino."
      maxWidth="sm"
      actions={
        <Button onClick={onClose} variant="contained" size="large">
          Cerrar
        </Button>
      }
    >
      {entries.length ? (
        <Stack spacing={0}>
          {entries.map((line, index) => (
            <Stack
              key={`${index}-${line.slice(0, 24)}`}
              direction="row"
              spacing={1.5}
              sx={{
                py: 1.25,
                borderTop: index ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  mt: 0.6,
                  flexShrink: 0,
                  bgcolor: 'primary.main',
                  boxShadow: `0 0 0 4px ${alpha('#0B6E6E', 0.12)}`,
                }}
              />
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {line}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">Sin movimientos registrados.</Typography>
      )}
    </AppDialog>
  );
};
