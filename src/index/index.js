import React from 'react'
// import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom'
import './index.css'
import './index.less'
import logo from './images/avatar.jpeg'


const App = () => {

  // debugger
  return (
    <div className="search">
      中文字体-测试
      <img src={logo} />
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)