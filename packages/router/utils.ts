//* ///product/detail/// -> /product/detail
export const normalizePathname = (pathname: string) => {
  return pathname.replace(/\/+$/, '').replace(/^\/*/, '/')
}
