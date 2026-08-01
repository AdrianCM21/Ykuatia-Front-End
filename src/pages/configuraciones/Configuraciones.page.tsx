import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { ConfiguracionesForm } from './ConfiguracionesForm';
import { ITipoCliente } from '../../interfaces/configuracion/configuracion';
import { getConfig, updateConfig } from '../../services/configuraciones/configuraciones.service';
import {
  getJunta,
  JuntaConfig,
  previewBoleta,
  removeJuntaLogo,
  updateJunta,
  uploadJuntaLogo,
} from '../../services/junta/junta.service';
import { toast } from 'react-toastify';
import config from '../../config';
import { PdfPreviewDialog } from '../../components/dialogs/PdfPreviewDialog';
import { revokePdfObjectUrl } from '../../utils/downloadBlob';

export const ConfiguracionesPage = () => {
  const [tab, setTab] = useState(0);
  const [tarifas, setTarifas] = useState<ITipoCliente[]>([]);
  const [junta, setJunta] = useState<JuntaConfig | null>(null);
  const [draft, setDraft] = useState<Partial<JuntaConfig>>({});
  const [refres, setRefres] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingJunta, setSavingJunta] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, [refres]);

  const loadAll = async () => {
    try {
      const [tarifasRes, juntaRes] = await Promise.all([getConfig(), getJunta()]);
      setTarifas(tarifasRes);
      setJunta(juntaRes);
      setDraft(juntaRes);
    } catch {
      toast.error('No se pudo cargar la configuración');
    }
  };

  const onSubmitTarifas = async (data: { precioFijo: number; precioPorLitro: number }) => {
    try {
      setLoading(true);
      await updateConfig({
        precioFijo: Number(data.precioFijo),
        precioPorLitro: Number(data.precioPorLitro),
      } as any);
      toast.success('Tarifas actualizadas');
      setRefres((v) => v + 1);
    } catch {
      toast.error('Error al guardar tarifas');
    } finally {
      setLoading(false);
    }
  };

  const onSaveJunta = async () => {
    setSavingJunta(true);
    try {
      const saved = await updateJunta({
        nombre: draft.nombre,
        slogan: draft.slogan,
        direccion: draft.direccion,
        telefono: draft.telefono,
        email: draft.email,
        pie_boleta: draft.pie_boleta,
        pie_recibo: draft.pie_recibo,
        color_primario: draft.color_primario,
        color_secundario: draft.color_secundario,
        margen_mm: Number(draft.margen_mm ?? 40),
        mostrar_timbrado: Boolean(draft.mostrar_timbrado),
        timbrado: draft.timbrado,
        ruc: draft.ruc,
        dias_gracia: Number(draft.dias_gracia ?? 14),
        mora_pct: Number(draft.mora_pct ?? 0),
        plantilla_boleta: draft.plantilla_boleta || 'clasica',
        papel_boleta: draft.papel_boleta || 'a4',
        boletas_por_pagina: Number(draft.boletas_por_pagina ?? 2),
      });
      setJunta(saved);
      setDraft(saved);
      toast.success(`Guardado (versión ${saved.version})`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al guardar junta');
    } finally {
      setSavingJunta(false);
    }
  };

  const onUploadLogo = async (file: File | undefined, tipo: 'principal' | 'secundario') => {
    if (!file) return;
    try {
      const saved = await uploadJuntaLogo(file, tipo);
      setJunta(saved);
      setDraft((d) => ({ ...d, ...saved }));
      toast.success('Logo actualizado');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al subir logo');
    }
  };

  const onRemoveLogo = async (tipo: 'principal' | 'secundario') => {
    try {
      const saved = await removeJuntaLogo(tipo);
      setJunta(saved);
      setDraft((d) => ({ ...d, ...saved }));
      toast.success(tipo === 'principal' ? 'Logo principal eliminado' : 'Logo secundario eliminado');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar logo');
    }
  };

  const onPreview = async () => {
    setPreviewing(true);
    try {
      revokePdfObjectUrl(previewUrl);
      const url = await previewBoleta(draft);
      setPreviewUrl(url);
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo generar el preview');
    } finally {
      setPreviewing(false);
    }
  };

  const onClosePreview = () => {
    revokePdfObjectUrl(previewUrl);
    setPreviewUrl(null);
  };

  const logoUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = (config.baseUrl || '').replace(/\/$/, '');
    return `${base}${path}`;
  };

  return (
    <Layout sectionTitle="CONFIGURACIÓN">
      <Box>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable">
          <Tab label="Tarifas" />
          <Tab label="Datos de la junta" />
          <Tab label="Formato de boleta" />
          <Tab label="Mora y vencimiento" />
        </Tabs>

        {tab === 0 && (
          <ConfiguracionesForm loading={loading} onSubmit={onSubmitTarifas} data={tarifas} />
        )}

        {tab === 1 && (
          <Grid container spacing={2} maxWidth={720}>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" mb={1}>
                Identidad de la junta usada en boletas y recibos.
              </Typography>
            </Grid>
            {(
              [
                ['nombre', 'Nombre'],
                ['slogan', 'Slogan'],
                ['direccion', 'Dirección'],
                ['telefono', 'Teléfono'],
                ['email', 'Email'],
              ] as const
            ).map(([key, label]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  value={draft[key] ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" loading={savingJunta} onClick={onSaveJunta}>
                Guardar datos
              </Button>
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Grid container spacing={2} maxWidth={900}>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                Textos, colores, márgenes y timbrado. Versión: {junta?.version ?? '-'} · Próximo N°
                boleta: {junta?.nro_boleta_actual ?? '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Pie de boleta"
                value={draft.pie_boleta ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, pie_boleta: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Pie de recibo"
                value={draft.pie_recibo ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, pie_recibo: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Color primario"
                type="color"
                value={draft.color_primario || '#0B6E6E'}
                onChange={(e) => setDraft((d) => ({ ...d, color_primario: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Color secundario"
                type="color"
                value={draft.color_secundario || '#1F4E79'}
                onChange={(e) => setDraft((d) => ({ ...d, color_secundario: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Margen (mm)"
                value={draft.margen_mm ?? 40}
                onChange={(e) => setDraft((d) => ({ ...d, margen_mm: Number(e.target.value) }))}
                inputProps={{ min: 20, max: 80 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RUC"
                value={draft.ruc ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, ruc: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timbrado"
                value={draft.timbrado ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, timbrado: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(draft.mostrar_timbrado)}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, mostrar_timbrado: e.target.checked }))
                    }
                  />
                }
                label="Mostrar timbrado / RUC / N° boleta en el PDF"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight={700} mb={1}>
                Plantilla de boleta
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                {(
                  [
                    ['basica', 'Básica'],
                    ['clasica', 'Clásica'],
                    ['compacta', 'Compacta'],
                    ['formal', 'Formal'],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    variant={draft.plantilla_boleta === value ? 'contained' : 'outlined'}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        plantilla_boleta: value,
                        ...(value === 'basica'
                          ? {
                              papel_boleta: d.papel_boleta || 'a4',
                              boletas_por_pagina: d.boletas_por_pagina || 2,
                              margen_mm: Math.min(Number(d.margen_mm ?? 20), 20),
                            }
                          : {}),
                      }))
                    }
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
              {draft.plantilla_boleta === 'basica' ? (
                <Typography variant="body2" color="text.secondary" mt={1.5}>
                  Pensada para juntas chicas: varias boletas en una sola hoja para imprimir y
                  cortar. Lo esencial del cobro, sin adornos.
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" mt={1.5}>
                  Una boleta por hoja. Usá Básica si querés ahorrar papel.
                </Typography>
              )}
            </Grid>

            {draft.plantilla_boleta === 'basica' && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} mb={1}>
                    Tamaño de hoja
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {(
                      [
                        ['a4', 'A4'],
                        ['oficio', 'Oficio'],
                      ] as const
                    ).map(([value, label]) => (
                      <Button
                        key={value}
                        variant={draft.papel_boleta === value ? 'contained' : 'outlined'}
                        onClick={() => setDraft((d) => ({ ...d, papel_boleta: value }))}
                      >
                        {label}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} mb={1}>
                    Boletas por hoja
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {(
                      [
                        [2, '2 (mitad)'],
                        [4, '4 (cuartos)'],
                      ] as const
                    ).map(([value, label]) => (
                      <Button
                        key={value}
                        variant={Number(draft.boletas_por_pagina) === value ? 'contained' : 'outlined'}
                        onClick={() => setDraft((d) => ({ ...d, boletas_por_pagina: value }))}
                      >
                        {label}
                      </Button>
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Incluye líneas de corte para separar con tijera o guillotina.
                  </Typography>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography fontWeight={700} mb={1}>
                Logos
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box>
                  <Typography variant="body2" mb={1}>
                    Logo principal
                  </Typography>
                  {logoUrl(draft.logo_principal) && (
                    <Box
                      component="img"
                      src={logoUrl(draft.logo_principal) || undefined}
                      alt="Logo principal"
                      sx={{ height: 72, mb: 1, objectFit: 'contain', display: 'block' }}
                    />
                  )}
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" component="label">
                      Subir
                      <input
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => onUploadLogo(e.target.files?.[0], 'principal')}
                      />
                    </Button>
                    {draft.logo_principal && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onRemoveLogo('principal')}
                      >
                        Quitar
                      </Button>
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="body2" mb={1}>
                    Logo secundario
                  </Typography>
                  {logoUrl(draft.logo_secundario) && (
                    <Box
                      component="img"
                      src={logoUrl(draft.logo_secundario) || undefined}
                      alt="Logo secundario"
                      sx={{ height: 72, mb: 1, objectFit: 'contain', display: 'block' }}
                    />
                  )}
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" component="label">
                      Subir
                      <input
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => onUploadLogo(e.target.files?.[0], 'secundario')}
                      />
                    </Button>
                    {draft.logo_secundario && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onRemoveLogo('secundario')}
                      >
                        Quitar
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" loading={savingJunta} onClick={onSaveJunta}>
                  Guardar formato
                </Button>
                <Button variant="outlined" loading={previewing} onClick={onPreview}>
                  Vista previa PDF
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}

        {tab === 3 && (
          <Grid container spacing={2} maxWidth={560}>
            <Grid item xs={12}>
              <Typography color="text.secondary" mb={1}>
                Días de gracia para el vencimiento al emitir, y porcentaje de mora mensual sobre el
                saldo vencido.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Días de gracia"
                value={draft.dias_gracia ?? 14}
                onChange={(e) => setDraft((d) => ({ ...d, dias_gracia: Number(e.target.value) }))}
                inputProps={{ min: 0, max: 90 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="% Mora"
                value={draft.mora_pct ?? 0}
                onChange={(e) => setDraft((d) => ({ ...d, mora_pct: Number(e.target.value) }))}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" loading={savingJunta} onClick={onSaveJunta}>
                Guardar mora
              </Button>
            </Grid>
          </Grid>
        )}

        <PdfPreviewDialog
          open={Boolean(previewUrl)}
          url={previewUrl}
          title="Vista previa de boleta"
          onClose={onClosePreview}
        />
      </Box>
    </Layout>
  );
};
