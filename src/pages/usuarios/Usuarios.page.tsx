import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { AppDialog } from '../../components/dialogs/AppDialog';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {
  createUsuario,
  deleteUsuario,
  getUsuarios,
  resetUsuarioPassword,
  updateUsuario,
  UsuarioAdmin,
} from '../../services/usuarios/usuarios.service';
import DeleteDialog from '../../components/DeleteDialog';

const ROLES = [
  { value: 'admin', label: 'Administrador (presidente)' },
  { value: 'presidente', label: 'Presidente' },
  { value: 'tesorero', label: 'Tesorero' },
  { value: 'cajero', label: 'Cajero' },
  { value: 'agente de campo', label: 'Agente de campo' },
];

export const UsuariosPage = () => {
  const [rows, setRows] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<UsuarioAdmin | null>(null);
  const [form, setForm] = useState({
    Nombre: '',
    email: '',
    password: '',
    rol: 'admin',
  });
  const [newPassword, setNewPassword] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setRows(await getUsuarios());
    } catch {
      toast.error('Error al listar usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'Nombre', headerName: 'Nombre', flex: 0.25 },
    { field: 'email', headerName: 'Email', flex: 0.3 },
    {
      field: 'rol',
      headerName: 'Rol',
      flex: 0.2,
      valueGetter: (_v, row) => row.rol?.descripcion,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 0.2,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => {
            setCurrent(params.row);
            setForm({
              Nombre: params.row.Nombre,
              email: params.row.email,
              password: '',
              rol: params.row.rol?.descripcion || 'admin',
            });
            setOpenForm(true);
          }}
        />,
        <GridActionsCellItem
          key="pwd"
          icon={<LockResetIcon />}
          label="Reset password"
          onClick={() => {
            setCurrent(params.row);
            setNewPassword('');
            setOpenPassword(true);
          }}
        />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setCurrent(params.row);
            setOpenDelete(true);
          }}
        />,
      ],
    },
  ];

  const onSave = async () => {
    setSaving(true);
    try {
      if (current) {
        await updateUsuario(current.id, {
          Nombre: form.Nombre,
          email: form.email,
          rol: form.rol,
        });
        toast.success('Usuario actualizado');
      } else {
        if (form.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          setSaving(false);
          return;
        }
        await createUsuario(form);
        toast.success('Usuario creado');
      }
      setOpenForm(false);
      setCurrent(null);
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const onResetPassword = async () => {
    if (!current) return;
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSaving(true);
    try {
      await resetUsuarioPassword(current.id, newPassword);
      toast.success('Contraseña actualizada');
      setOpenPassword(false);
      setNewPassword('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo resetear');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!current) return;
    setSaving(true);
    try {
      await deleteUsuario(current.id);
      toast.success('Usuario eliminado');
      setOpenDelete(false);
      setCurrent(null);
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo eliminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout sectionTitle="USUARIOS">
      <>
        <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
          <Typography color="text.secondary">
            Administrá accesos de oficina. No se muestra la contraseña en claro.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setCurrent(null);
              setForm({ Nombre: '', email: '', password: '', rol: 'admin' });
              setOpenForm(true);
            }}
          >
            Nuevo usuario
          </Button>
        </Box>
        <Box sx={{ height: 440 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            hideFooter
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>

        <AppDialog
          open={openForm}
          onClose={() => !saving && setOpenForm(false)}
          disableClose={saving}
          eyebrow="Accesos"
          title={current ? 'Editar usuario' : 'Nuevo usuario'}
          subtitle="Definí nombre, correo y rol de oficina."
          maxWidth="sm"
          actions={
            <>
              <Button disabled={saving} onClick={() => setOpenForm(false)} size="large" variant="outlined">
                Cancelar
              </Button>
              <Button loading={saving} variant="contained" size="large" onClick={onSave}>
                {current ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
            </>
          }
        >
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={form.Nombre}
              onChange={(e) => setForm((f) => ({ ...f, Nombre: e.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            {!current && (
              <TextField
                label="Contraseña"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                helperText="Mínimo 6 caracteres"
              />
            )}
            <TextField
              select
              label="Rol"
              value={form.rol}
              onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </AppDialog>

        <AppDialog
          open={openPassword}
          onClose={() => !saving && setOpenPassword(false)}
          disableClose={saving}
          eyebrow="Seguridad"
          title="Resetear contraseña"
          subtitle={`Nueva contraseña para ${current?.Nombre || 'el usuario'}.`}
          maxWidth="xs"
          actions={
            <>
              <Button disabled={saving} onClick={() => setOpenPassword(false)} size="large" variant="outlined">
                Cancelar
              </Button>
              <Button
                loading={saving}
                color="warning"
                variant="contained"
                size="large"
                onClick={onResetPassword}
              >
                Confirmar reset
              </Button>
            </>
          }
        >
          <TextField
            fullWidth
            type="password"
            label="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Mínimo 6 caracteres. No se mostrará después de guardar."
          />
        </AppDialog>

        <DeleteDialog
          open={openDelete}
          loading={saving}
          onConfirm={onDelete}
          onClose={() => setOpenDelete(false)}
        />
      </>
    </Layout>
  );
};
