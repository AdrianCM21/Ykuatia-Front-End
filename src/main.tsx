import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/index.routes';
import { Provider } from 'react-redux';
import {store} from './redux/store'
// import './index.css'

 const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

 root.render(
    <Provider  store={store}>
    <RouterProvider  router={router} />
  </Provider>
)