import { ReactNode, useContext } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'

export const fakeAuthProvider = {
  isAuthenticated: false,
  signIn(callback: (...args: any[]) => any) {
    fakeAuthProvider.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  },
  signOut(callback: (...args: any[]) => any) {
    fakeAuthProvider.isAuthenticated = false
    setTimeout(callback, 100)
  },
}

type AuthContextType = {
  user: string | FormDataEntryValue | null
  signIn: (
    username: string | FormDataEntryValue | null,
    callback?: () => void,
  ) => void
  signOut: (callback?: () => void) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<null | string | FormDataEntryValue>(null)

  const signIn = useCallback(
    (username: string | FormDataEntryValue | null, callback?: () => void) => {
      setUser(username)
      callback?.()
    },
    [],
  )

  const signOut = useCallback((callback?: () => void) => {
    setUser(null)
    callback?.()
  }, [])

  const value = useMemo(() => {
    return { user, signIn, signOut }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
