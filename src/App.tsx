/* eslint-disable react/prop-types */
import './App.css'
import {
  Component,
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
} from './which-react'

function App() {
  const [count, setCount] = useReducer((x: number) => x + 1, 0)
  const [num, setNum] = useState(0)

  useEffect(() => {
    console.log('useEffect num')
  }, [num])

  useLayoutEffect(() => {
    console.log('useLayoutEffect num')
  }, [num])

  return (
    <div className="App">
      <div className="border">
        <h1>react</h1>
        <a href="https://github.com/kizuner-bonely/oh-my-mini-react">
          oh-my-mini-react
        </a>

        <div>
          <button onClick={setCount}>{count}</button>
          <button onClick={() => setNum(num + 1 > 5 ? 0 : num + 1)}>
            {num}
          </button>
        </div>

        <div>{count % 2 ? <div>Kizuna AI</div> : <p>love</p>}</div>

        {/* <ul>
          {[1, 2, 3, 4, 5].map(s => (num >= s ? <li key={s}>{s}</li> : null))}
        </ul> */}

        <div>
          <h3>diff</h3>
          {/* <ul>
            {num % 2 === 0
              ? [0, 1, 2, 3, 4].map(n => <li key={n}>{n}</li>)
              : [1, 3, 4].map(n => <li key={n}>{n}</li>)}
          </ul> */}

          <ul>
            {/* {num % 2 === 0
              ? [0, 1, 3, 4].map(n => <li key={n}>{n}</li>)
              : [0, 1, 2, 3, 4].map(n => <li key={n}>{n}</li>)} */}
            {num % 2 === 0
              ? [2, 1, 3, 4].map(n => <li key={n}>{n}</li>)
              : [0, 1, 2, 3, 4].map(n => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </div>

      <FunctionComponent name="函数组件" />

      {/* @ts-ignore */}
      <ClassComponent name="类组件" />

      <FragmentComponent />
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

function FragmentComponent() {
  return (
    <div className="border">
      <>
        <p>fragment 1</p>
      </>
    </div>
  )
}

export default App
