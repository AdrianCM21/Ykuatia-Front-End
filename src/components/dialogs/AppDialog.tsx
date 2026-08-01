import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';

type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: MaxWidth;
  disableClose?: boolean;
  /** Contenido scrolleable (default true) */
  scrollable?: boolean;
};

/**
 * Shell visual compartido para modales de oficina (mismo estilo que cobro / cliente).
 */
export const AppDialog = ({
  open,
  onClose,
  title,
  eyebrow,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  disableClose = false,
  scrollable = true,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={disableClose ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          flexShrink: 0,
          background:
            'linear-gradient(135deg, rgba(11,110,110,0.10) 0%, rgba(31,78,121,0.08) 55%, rgba(232,242,242,0.9) 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'relative',
        }}
      >
        <IconButton
          size="small"
          onClick={onClose}
          disabled={disableClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Cerrar"
        >
          <CloseIcon />
        </IconButton>
        {eyebrow ? (
          <Typography variant="overline" color="text.secondary" letterSpacing={1}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h5" pr={4}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" mt={0.5} pr={4}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      <DialogContent
        dividers={scrollable}
        sx={{
          px: 3,
          py: 2.5,
          flex: scrollable ? '1 1 auto' : undefined,
          overflowY: scrollable ? 'auto' : 'visible',
        }}
      >
        {children}
      </DialogContent>

      {actions ? (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexShrink: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha('#0B6E6E', 0.03),
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
};
