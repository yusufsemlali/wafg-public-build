"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export type Profile = {
  id: string
  user_id: string
  username?: string
  avatar_url?: string | null
  role?: string
  member_since?: string
  created_at?: string
  updated_at?: string
  [key: string]: any // Allow any other properties
}

export function useMemberSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true) // Assume table exists until proven otherwise

  const searchMembers = useCallback(async (query: string) => {
    if (!query.trim()) {
      // If query is empty, fetch recent members instead
      return fetchRecentMembers()
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Try a simple query first to see if the table exists and what columns it has
      const { data: sampleData, error: sampleError } = await supabase.from("profiles").select("*").limit(1)

      if (sampleError) {
        // Check if the error is because the table doesn't exist
        if (sampleError.message.includes("does not exist")) {
          setTableExists(false)
          throw new Error("The members directory is not available at this time.")
        }

        // If it's not a "no rows" error, it's a real error
        if (!sampleError.message.includes("no rows")) {
          console.error("Error checking profiles schema:", sampleError)
          throw sampleError
        }
      }

      // Table exists, continue with search
      setTableExists(true)

      // Determine what columns we can use based on the sample data
      const hasUsername = sampleData && sampleData[0] && "username" in sampleData[0]

      // Try to use the search_profiles RPC function
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc("search_profiles", {
          search_query: query,
        })

        if (rpcError) {
          console.warn("RPC search failed, falling back to direct query:", rpcError)
          throw rpcError
        }

        setMembers(rpcData || [])
      } catch (rpcError) {
        // Fallback to direct query if RPC fails
        // Only search by username if it exists
        let queryBuilder = supabase.from("profiles").select("*")

        if (hasUsername) {
          queryBuilder = queryBuilder.ilike("username", `%${query}%`)
        }

        const { data: queryData, error: queryError } = await queryBuilder.limit(20)

        if (queryError) {
          throw queryError
        }

        setMembers(queryData || [])
      }
    } catch (err: any) {
      console.error("Error searching members:", err)
      setError(err.message || "Failed to search members")
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentMembers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Try to determine if the table exists and what columns it has
      const { data: sampleData, error: sampleError } = await supabase.from("profiles").select("*").limit(1)

      if (sampleError) {
        // Check if the error is because the table doesn't exist
        if (sampleError.message.includes("does not exist")) {
          setTableExists(false)
          throw new Error("The members directory is not available at this time.")
        }

        // If it's not a "no rows" error, it's a real error
        if (!sampleError.message.includes("no rows")) {
          console.error("Error checking profiles schema:", sampleError)
          throw sampleError
        }
      }

      // Table exists, continue with fetch
      setTableExists(true)

      // Determine what columns we can use for sorting
      const hasMemberSince = sampleData && sampleData[0] && "member_since" in sampleData[0]
      const hasCreatedAt = sampleData && sampleData[0] && "created_at" in sampleData[0]

      let queryBuilder = supabase.from("profiles").select("*")

      // Sort by the appropriate column if it exists
      if (hasMemberSince) {
        queryBuilder = queryBuilder.order("member_since", { ascending: false })
      } else if (hasCreatedAt) {
        queryBuilder = queryBuilder.order("created_at", { ascending: false })
      }

      const { data, error: fetchError } = await queryBuilder.limit(20)

      if (fetchError) {
        throw fetchError
      }

      setMembers(data || [])
    } catch (err: any) {
      console.error("Error fetching recent members:", err)
      setError(err.message || "Failed to fetch members")
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchMembers(searchQuery)
      } else {
        fetchRecentMembers()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchMembers, fetchRecentMembers])

  // Initial load
  useEffect(() => {
    fetchRecentMembers()
  }, [fetchRecentMembers])

  return {
    searchQuery,
    setSearchQuery,
    members,
    loading,
    error,
    tableExists,
    searchMembers,
    fetchRecentMembers,
  }
}
