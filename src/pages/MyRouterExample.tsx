import { BrowserRouter as Router, Routes, Route } from '@router'

export default function MyRouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="product" element={<Product />} />
      </Routes>
    </Router>
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
