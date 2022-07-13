import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
  useParams,
} from '@router'
import styles from './router.module.less'

export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="product" element={<Product />}>
            <Route path=":id" element={<ProductDetail />} />
          </Route>
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

      <Outlet />
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
      <Link to="/product/123">商品详情</Link>

      <Outlet />
    </div>
  )
}

function ProductDetail() {
  const navigate = useNavigate()
  const params = useParams()

  return (
    <div>
      <h1>ProductDetail</h1>
      <p>{params?.id}</p>
      <button onClick={() => navigate('/')}>go home</button>
    </div>
  )
}
