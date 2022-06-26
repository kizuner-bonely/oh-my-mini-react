import { ReactDOM } from './which-react'
// import App from './App'
import './index.css'
import { FiberType } from '@react/types/VnodeType'

const jsx = (
  <div className="App">
    <h1>react</h1>
    <a href="https://github.com/kizuner-bonely/oh-my-mini-react">
      oh-my-mini-react
    </a>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  // (<App />) as VnodeType,
  jsx as FiberType,
)
