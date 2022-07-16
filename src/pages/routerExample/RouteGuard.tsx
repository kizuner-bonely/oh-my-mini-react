import type { FormEvent } from 'react'
import { useCallback, lazy, Suspense } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
  useLocation,
} from '@router'

const About = lazy(() =>
  import('./About').then(({ About }) => ({
    default: About,
  })),
)

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Outlet,
//   useNavigate,
//   useParams,
//   Navigate,
//   useLocation,
// } from 'react-router-dom'

import { AuthProvider, useAuth } from './auth'

import styles from './router.module.less'

export default function RouteGuardExample() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="product" element={<Product />}>
              <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route
              path="user"
              element={
                <RequireAuth>
                  <User />
                </RequireAuth>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<h1>loading...</h1>}>
                  <About />
                </Suspense>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NoMatched />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

function Layout() {
  return (
    <div className={styles.layout}>
      <NavLink to="/">首页</NavLink>
      <NavLink to="/product">商品</NavLink>
      <NavLink to="/about">关于</NavLink>
      <NavLink to="/user">用户中心</NavLink>
      <NavLink to="/login">登录</NavLink>

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

function User() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleSignOut = useCallback(() => {
    auth.signOut(() => navigate('/login'))
  }, [])

  return (
    <div>
      <h1>User</h1>
      <p>{auth.user!.toString()}</p>
      <button onClick={handleSignOut}>退出登录</button>
    </div>
  )
}

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from.pathname ?? '/'

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')

    auth.signIn(username, () => {
      navigate(from, { replace: true })
    })
  }, [])

  if (auth.user) {
    return <Navigate to={from} replace />
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

function NoMatched() {
  return (
    <div>
      <h1>NoMatched</h1>
    </div>
  )
}

type RequireAuthProps = {
  children: JSX.Element
}

function RequireAuth(props: RequireAuthProps) {
  const { children } = props
  const location = useLocation()
  const auth = useAuth()

  if (!auth.user) {
    return <Navigate state={{ from: location }} to="/login" replace />
  }

  return children
}
