import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = null

    const fetchRole = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()
        if (error) return null
        return data?.role || null
      } catch {
        return null
      }
    }

    const init = async () => {
      setLoading(true)

      if (!supabase) {
        setSession(null)
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(session || null)
      setUser(session?.user || null)
      if (session?.user?.id) {
        const r = await fetchRole(session.user.id)
        if (!isMounted) return
        setRole(r)
      } else {
        setRole(null)
      }
      setLoading(false)

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        // Do NOT toggle loading here; keep UI responsive
        setSession(session || null)
        setUser(session?.user || null)
        if (session?.user?.id) {
          const r = await fetchRole(session.user.id)
          // Only update if fetched value is not null to avoid wiping role during refresh
          if (r !== null) setRole(r)
        } else {
          // Signed out
          setRole(null)
        }
      })
      unsubscribe = listener?.subscription?.unsubscribe
    }

    init()

    return () => {
      isMounted = false
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, user, role, loading }), [session, user, role, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext) 