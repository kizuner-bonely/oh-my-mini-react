// import type { FiberType } from '@react/types/VnodeType'
// import { ReactDOM } from './which-react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // (<App />) as FiberType,
  <App />,
)
