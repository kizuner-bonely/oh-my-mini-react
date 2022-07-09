## oh-my-mini-react

一个学习 React 及其周边工具源码的小项目

### 启动方式

1. 安装依赖
   ```shell
   pnpm i
   ```

2. 启动项目

   ```shell
   pnpm run dev
   ```



### 手写项目

- **mini-react**

  * 启动

    * 修改 React 启动方式 `/src/main.tsx`
      ```tsx
      import type { FiberType } from '@react/types/VnodeType'
      import { ReactDOM } from './which-react'
      import App from './App'
      import './index.css'
      
      ReactDOM.createRoot(document.getElementById('root')!).render(
        (<App />) as FiberType,
      )
      ```

    * 更换渲染组件 `/src/App.tsx`
      ```tsx
      import MiniReact from './pages/MiniReact'
      import './App.less'
      
      function App() {
        return (
          <div className="App">
            <MiniReact />
          </div>
        )
      }
      
      export default App
      ```

  * 代码位置
    ```
    /packages/react
    /packages/react-dom
    ```

- **Antd Form**

  - 启动

    - 修改 React 启动方式 `/src/main.tsx`
      ```tsx
      import ReactDOM from 'react-dom/client'
      import App from './App'
      import './index.css'
      
      ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
      ```

    * 更换渲染组件 `/src/App.tsx`

      ```tsx
      import MyRCFieldForm from './pages/MyRCFieldForm'
      import './App.less'
      
      function App() {
        return (
          <div className="App">
            <MyRCFieldForm />
          </div>
        )
      }
      
      export default App
      ```

  - 代码位置
    ```
    /packages/form
    ```

  - 更换函数组件/类组件版本的 Field  `/packages/form/index.ts`
    ```ts
    import Form from './Form'
    // import ComponentField from './ComponentField'
    import FunctionField from './FunctionField'
    import useForm from './useForm'
    
    export {
      //  ComponentField as Field,
      FunctionField as Field,
      useForm,
    }
    export default Form
    ```

    按需注释和解开注释

* **redux**

  * 启动

    * 修改 React 启动方式 `/src/main.tsx`
      ```tsx
      import ReactDOM from 'react-dom/client'
      import App from './App'
      import './index.css'
      
      ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
      ```

    * 更换渲染组件 `/src/App.tsx`

      ```tsx
      import ReduxExample from './pages/reduxExample/ReduxExample'
      import './App.less'
      
      function App() {
        return (
          <div className="App">
            <ReduxExample />
          </div>
        )
      }
      
      export default App
      ```

  * 代码位置
    ```
    /packages/redux
    ```

    

