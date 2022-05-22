import React from 'react'
// import { createRoot } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './index.css'
import './index.less'

const App = () => {
  return (
    <div className="search">hello</div>
  )
}
const root = createRoot(document.getElementById('root'))
root.render(<App />)