import './App.css'

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
    </div>
  )
}

function FunctionComponent(props: { name: string }) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  )
}

export default App
