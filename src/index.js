import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './index.less'
import logo from './images/avatar.jpeg'


const App = () => {
  return (
    <div className="search">
      中文字体-测试
      <img src={logo} />
    </div>
  )
}
const root = createRoot(document.getElementById('root'))
root.render(<App />)