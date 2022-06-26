/* eslint-disable react/prop-types */
import './App.css'
import { Component } from './which-react'

function App() {
  return (
    <div className="App">
      <div className="border">
        <h1>react</h1>
        <a href="https://github.com/kizuner-bonely/oh-my-mini-react">
          oh-my-mini-react
        </a>
      </div>

      <FunctionComponent name="函数组件" />

      {/* @ts-ignore */}
      <ClassComponent name="类组件" />
    </div>
  )
}

function FunctionComponent(props: { name: string }) {
  return (
    <div className="border">
      <p>{props.name}</p>
      我是文本
    </div>
  )
}

// @ts-ignore
class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        {/* @ts-ignore */}
        <h3>{this.props.name}</h3>
      </div>
    )
  }
}

export default App
