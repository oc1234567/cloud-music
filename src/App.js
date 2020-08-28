import React from 'react';
import { Provider } from 'react-redux';

import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';

import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';
import routes from './routes/index';

import store from './store/index';

//使用 Context 实现局部状态管理
import DataProvider from './application/Singers/data';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <DataProvider>
          { renderRoutes(routes) }
        </DataProvider>
      </HashRouter>
    </Provider>
  )
}

export default App;
