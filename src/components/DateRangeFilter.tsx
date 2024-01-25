// DateRangeFilter.tsx
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useState } from 'react';
import { es } from 'date-fns/locale';
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';

interface DateRangeFilterProps {
    dateRange: { startDate: Date, endDate: Date, key: string }[],
    setDateRange: (newDateRange: { startDate: Date, endDate: Date, key: string }[]) => void
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, setDateRange }) => {
    const [open, setOpen] = useState(false);
    

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const predefinedRanges: { [key: string]: [Date, Date] } = {
        'Este mes': [startOfMonth(new Date()), endOfMonth(new Date())],
        'Mes pasado': [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
        'Este año': [startOfYear(new Date()), endOfYear(new Date())],
        'Año pasado': [startOfYear(subYears(new Date(), 1)), endOfYear(subYears(new Date(), 1))],
    };

    const staticRanges = Object.keys(predefinedRanges).map(key => ({
        label: key,
        range: () => ({ startDate: predefinedRanges[key][0], endDate: predefinedRanges[key][1] }),
        isSelected: (range: { startDate: Date, endDate: Date, key: string }) => 
            range.startDate.getTime() === predefinedRanges[key][0].getTime() &&
            range.endDate.getTime() === predefinedRanges[key][1].getTime()
    }));

    return (
        <Box sx={{marginBottom:'1em'}}>
            <Button variant="outlined" onClick={handleOpen}>
                Filtrar por fecha
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogTitle>Filtrar por fecha</DialogTitle>
                <DialogContent>
                    <DateRangePicker
                        ranges={dateRange}
                        onChange={(item:any) => setDateRange([{ startDate: item.selection.startDate, endDate: item.selection.endDate, key: 'selection' }])}
                        locale={es}
                        rangeColors={['#14539a']}
                        staticRanges={staticRanges}
                        
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}