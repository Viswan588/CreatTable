import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App';

import configStore from './redux/store';
import { Provider } from 'react-redux';

const store = configStore()

console.log(store.getState())

store.subscribe(() => {
  console.log('state get updated', store.getState());
})


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);