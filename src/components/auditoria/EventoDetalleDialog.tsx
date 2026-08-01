import { Box, Button, Chip, Stack, Typography, alpha } from '@mui/material';
import { format } from 'date-fns';
import { EventoAuditoria } from '../../services/auditoria/auditoria.service';
import {
  entriesDetalleAuditoria,
  labelAccionAuditoria,
} from '../../utils/auditoriaDetalle';
import { AppDialog } from '../dialogs/AppDialog';

type Props = {
  open: boolean;
  evento: EventoAuditoria | null;
  onClose: () => void;
};

export const EventoDetalleDialog = ({ open, evento, onClose }: Props) => {
  const entries = entriesDetalleAuditoria(evento?.detalle);

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow="Auditoría"
      title={evento ? labelAccionAuditoria(evento.accion) : 'Detalle'}
      subtitle="Información registrada del evento."
      maxWidth="sm"
      actions={
        <Button onClick={onClose} variant="contained" size="large">
          Cerrar
        </Button>
      }
    >
      {evento ? (
        <Stack spacing={2}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip
              size="small"
              label={format(new Date(evento.created_at), 'dd/MM/yyyy HH:mm')}
              variant="outlined"
            />
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={evento.usuario?.Nombre || 'Sistema'}
            />
            <Chip
              size="small"
              label={`${evento.entidad}${evento.entidad_id != null ? ` #${evento.entidad_id}` : ''}`}
            />
          </Stack>

          {entries.length ? (
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {entries.map((item, idx) => (
                <Stack
                  key={item.key}
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: idx % 2 === 0 ? alpha('#0B6E6E', 0.03) : 'background.paper',
                    borderTop: idx ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} textAlign="right">
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">Sin datos adicionales.</Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            Acción técnica: {evento.accion}
          </Typography>
        </Stack>
      ) : (
        <Typography color="text.secondary">Sin evento seleccionado.</Typography>
      )}
    </AppDialog>
  );
};
