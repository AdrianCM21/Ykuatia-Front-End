import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { AppThemeProvider } from './theme/AppThemeProvider';
import './index.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <AppThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppThemeProvider>
  </Provider>
);
