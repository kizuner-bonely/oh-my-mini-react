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

  - 代码位置
    ```
    /packages/react
    /packages/react-dom
    ```

- **Antd Form**

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

  * 代码位置
    ```
    /packages/redux
    ```

* **router**

  * 代码位置
    ```
    /packages/router
    ```

    

