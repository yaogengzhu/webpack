import React, { useState } from 'react'
import ReactDOM from 'react-dom'
const OtherComponent = React.lazy(() => import('./text'))


import './index.css'
import './index.less'
import logo from './images/avatar.jpeg'


const App = () => {
  const [Text, setText] = useState(null)
  
  return (
    <div className="search">
      中文字体-测试
      <img src={logo} />
      <button>按钮</button>
      <OtherComponent />
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)