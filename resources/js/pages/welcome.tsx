// --- App.tsx ---
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import axios from 'axios'

function App() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [notification, setNotification] = useState('')

  const fetchUsers = async (currentPage = 1) => {
    try {
      const res = await axios.get(`/api/users?page=${currentPage}`)
      setUsers(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  useEffect(() => {
    const channel = supabase
      .channel('users-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, async (payload) => {
        setNotification(`New user: ${payload.new.name}`)

        // Call Laravel API
        await axios.post('/api/process-user', { userId: payload.new.id })

        // Refresh user list
        fetchUsers(page)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [page])

  return (
    <div className="p-4 max-w-xl mx-auto">
      {notification && <div className="bg-green-200 text-green-800 p-2 rounded mb-4">{notification}</div>}

      <h2 className="text-xl font-bold mb-4">Latest Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2 rounded shadow">{user.name}</li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="bg-gray-300 px-3 py-1 rounded">Previous</button>
        <button onClick={() => setPage((p) => p + 1)} className="bg-gray-300 px-3 py-1 rounded">Next</button>
      </div>
    </div>
  )
}

export default App
