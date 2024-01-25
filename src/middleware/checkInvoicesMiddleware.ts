// import { Middleware, Action } from '@reduxjs/toolkit';
// import { RootState } from '../redux/store'; // Asegúrate de importar RootState desde tu archivo store
// import { checkInvoices, setHasNotification } from '../redux/invoices/invoiceSlice'; 

// export const checkInvoicesMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => (action: Action) => {
//     next(action);

//     setInterval(async () => {
//         const invoicesAreMissingData = await checkInvoices();

//         if (invoicesAreMissingData) {
//             storeApi.dispatch(setHasNotification(true));
//         } else {
//             storeApi.dispatch(setHasNotification(false));
//         }
//     }, 12 * 60 * 60 * 1000); // 12 horas en milisegundos
// };