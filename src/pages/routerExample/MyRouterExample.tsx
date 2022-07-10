import { BrowserRouter as Router, Routes, Route, Link } from '@router'
import styles from './router.module.less'

export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="product" element={<Product />} />
        </Route>
      </Routes>
    </Router>
  )
}

function Layout() {
  return (
    <div className={styles.layout}>
      <Link to="/">首页</Link>
      <Link to="/product">商品</Link>

      {/* <Outlet /> */}
    </div>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

function Product() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  )
}
