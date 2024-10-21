import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ReactDOM.createRoot() is used to create a root component.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // React.StrictMode用于开发模式下的错误提示，生产模式下可以忽略
  //<App />被渲染到root中，root在index.html中被挂载
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//添加下面代码可以实现热更新，不需要刷新浏览器
//在package.json中添加"start": "GENERATE_SOURCEMAP=false"可以让我们保存脚手架时不自动刷新网站
if (import.meta.hot) {
  // 热更新
  import.meta.hot.accept();
}

reportWebVitals();
