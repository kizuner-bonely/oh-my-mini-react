import { ReactDOM } from './which-react'
import App from './App'
import type { FiberType } from '@react/types/VnodeType'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  (<App />) as FiberType,
)
