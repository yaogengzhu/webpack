import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './index.less';
import logo from './images/avatar.jpeg';

const OtherComponent = React.lazy(() => import('./text'));

function App() {
  return (
    <div className="search">
      中文字体-测试xx
      <img src={logo} alt="" />
      <button type="button">按钮12</button>
      <OtherComponent />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
