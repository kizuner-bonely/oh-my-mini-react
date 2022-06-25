import { ReactDOM } from './which-react'
import App from './App'
import './index.css'
import { VnodeType } from '@react/types/VnodeType'

ReactDOM.createRoot(document.getElementById('root')!).render(
  (<App />) as VnodeType,
)
