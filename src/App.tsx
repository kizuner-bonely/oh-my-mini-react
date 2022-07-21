import { useEffect, useRef } from 'react'
import { Tabs } from 'antd'
import type { FiberType } from '@react/types/VnodeType'
import { ReactDOM } from './which-react'
import MiniReact from './pages/MiniReact'
// import MyFormily from './pages/MyFormily'
import MyRCFieldForm from './pages/MyRCFieldForm'
import ReduxExample from './pages/reduxExample/ReduxExample'
import MyRouterExample from './pages/routerExample/MyRouterExample'
import RouteGuard from './pages/routerExample/RouteGuard'
import './App.less'

const { TabPane } = Tabs

function App() {
  useEffect(() => {
    ReactDOM.createRoot(document.getElementById('slot')!).render(
      (<MiniReact />) as FiberType,
    )
  }, [])

  const menuConfig = useRef([
    // { label: 'formily', component: <MyFormily /> },
    { label: 'form', component: <MyRCFieldForm /> },
    { label: 'redux', component: <ReduxExample /> },
    { label: 'router', component: <MyRouterExample /> },
    { label: 'route-guard', component: <RouteGuard /> },
  ]).current

  return (
    <div className="App">
      <Tabs defaultActiveKey="mini-react">
        {menuConfig.map(({ label, component }) => (
          <TabPane key={label} tab={label}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

export default App
