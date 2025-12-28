import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/reduxstore/hooks/hooks'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { Users, Hospital as HospitalIcon, Truck, MapPin, Edit, Trash, CheckCircle, XCircle } from 'lucide-react'
import { fetchHospitals, fetchUsers } from '@/lib/adminApi'
const AdminPage = () => {
  const data = useAppSelector((state) => state.auth); 
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

 // const authToken = data.authToken
  const role = useAppSelector((state) => state.auth.role)

  // Hospital form state
  const [hospital, setHospital] = useState({ name: '', email: '', latitude: '', longitude: '', address: '', ambulance_id: '', ambulance_engaged: false })
  // User form state
  const [user, setUser] = useState({ name: '', email: '', password: '', role: 'user', ambulance_id: '', mobilenumber: '' })

  // Lists and editing state
  const [hospitals, setHospitals] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])
  const [isEditingHospital, setIsEditingHospital] = useState(false)
  const [editingHospitalId, setEditingHospitalId] = useState<number | null>(null)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [loadingLists, setLoadingLists] = useState(false)

  const headers = data.authToken ? { Authorization: `Bearer ${data.authToken}` } : {}

  console.log(data , "the authtoken")
  console.log(headers , "the headers")

  useEffect(() => {
    if (role === 'admin') loadLists()
  }, [role])

  const loadLists = async () => {
    setLoadingLists(true)
    try {
      const [h, u] = await Promise.all([
        fetchHospitals(headers),
        fetchUsers(headers),
      ])
      setHospitals(h)
      setUsersList(u)
    } catch (err) {
      // ignore fetch errors
    } finally {
      setLoadingLists(false)
    }
  }

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation not available'))
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(err)
      )
    })

  if (!mounted) return null

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Access denied</h2>
          <p className="text-sm text-gray-500 mt-2">You must be an admin to view this page.</p>
          <div className="mt-4">
            <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-blue-500 text-white rounded">Back to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  // headers already defined above

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hospital.name) return toast.error('Hospital name is required')

    try {
      // If lat/long are empty, try to get them from the browser
      if (!hospital.latitude || !hospital.longitude) {
        try {
          const loc = await getCurrentLocation()
          setHospital((s) => ({ ...s, latitude: String(loc.latitude), longitude: String(loc.longitude) }))
          hospital.latitude = String(loc.latitude)
          hospital.longitude = String(loc.longitude)
        } catch (err) {
          // user denied or not available - proceed without location
        }
      }

      const payload = {
        name: hospital.name,
        email: hospital.email,
        latitude: hospital.latitude || undefined,
        longitude: hospital.longitude || undefined,
        address: hospital.address,
        ambulance_id: hospital.ambulance_id,
        ambulance_engaged: hospital.ambulance_engaged
      }

      const res = await axios.post('https://medical-backend-dbt2.onrender.com/api/admin/add-hospital', payload, { headers })
      if (res.data && res.data.success) {
        toast.success('Hospital added')
        setHospital({ name: '', email: '', latitude: '', longitude: '', address: '', ambulance_id: '', ambulance_engaged: false })
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to add hospital')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || String(err))
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user.name || !user.email || !user.password) {
      return toast.error('Name, email and password are required')
    }

    try {
      const payload = { ...user }
      const res = await axios.post('https://medical-backend-dbt2.onrender.com/api/admin/add-user', payload, { headers })
      if (res.data && res.data.success) {
        toast.success('User created')
        setUser({ name: '', email: '', password: '', role: 'user', ambulance_id: '', mobilenumber: '' })
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to create user')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || String(err))
    }
  }

  // Update hospital
  const handleHospitalUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHospitalId) return
    try {
      const payload: any = { ...hospital, hospital_id: editingHospitalId }
      const res = await axios.put('https://medical-backend-dbt2.onrender.com/api/admin/update-hospital', payload, { headers })
      if (res.data && res.data.success) {
        toast.success('Hospital updated')
        setHospital({ name: '', email: '', latitude: '', longitude: '', address: '', ambulance_id: '', ambulance_engaged: false })
        setIsEditingHospital(false)
        setEditingHospitalId(null)
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to update hospital')
      }
    } catch (err: any) {
      // fallback: try re-adding
      toast.error(err?.response?.data?.message || 'Update failed')
    }
  }

  const onEditHospital = (h: any) => {
    setHospital({ name: h.name || '', email: h.email || '', latitude: h.latitude || '', longitude: h.longitude || '', address: h.address || '', ambulance_id: h.ambulance_id || '', ambulance_engaged: !!h.ambulance_engaged })
    setIsEditingHospital(true)
    setEditingHospitalId(h.hospital_id || null)
  }

  const cancelEditHospital = () => {
    setHospital({ name: '', email: '', latitude: '', longitude: '', address: '', ambulance_id: '', ambulance_engaged: false })
    setIsEditingHospital(false)
    setEditingHospitalId(null)
  }

  const deleteHospital = async (id: number) => {
    if (!confirm('Delete this hospital?')) return
    try {
      const res = await axios.delete(`https://medical-backend-dbt2.onrender.com/api/admin/hospital/${id}`, { headers })
      if (res.data && res.data.success) {
        toast.success('Hospital deleted')
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to delete')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || String(err))
    }
  }

  // Update user
  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return
    try {
      const payload: any = { ...user, user_id: editingUserId }
      const res = await axios.put('https://medical-backend-dbt2.onrender.com/api/admin/update-user', payload, { headers })
      if (res.data && res.data.success) {
        toast.success('User updated')
        setUser({ name: '', email: '', password: '', role: 'user', ambulance_id: '', mobilenumber: '' })
        setIsEditingUser(false)
        setEditingUserId(null)
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to update user')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || String(err))
    }
  }

  const onEditUser = (u: any) => {
    setUser({ name: u.name || '', email: u.email || '', password: '', role: u.role || 'user', ambulance_id: u.ambulance_id || '', mobilenumber: u.mobilenumber || '' })
    setIsEditingUser(true)
    setEditingUserId(u.user_id || null)
  }

  const cancelEditUser = () => {
    setUser({ name: '', email: '', password: '', role: 'user', ambulance_id: '', mobilenumber: '' })
    setIsEditingUser(false)
    setEditingUserId(null)
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return
    try {
      const res = await axios.delete(`https://medical-backend-dbt2.onrender.com/api/admin/user/${id}`, { headers })
      if (res.data && res.data.success) {
        toast.success('User deleted')
        loadLists()
      } else {
        toast.error(res.data?.message || 'Failed to delete user')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || String(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center space-x-3"><HospitalIcon className="w-6 h-6 text-indigo-600" /><span>Admin Panel</span></h1>
            <p className="text-sm text-gray-500 mt-1">Manage hospitals, ambulances and users</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push('/dashboard')} className="px-3 py-2 bg-white rounded border border-gray-200 text-gray-700 hover:bg-gray-50">Back to Dashboard</button>
            <button onClick={loadLists} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2"><HospitalIcon className="w-5 h-5 text-indigo-600" /><span>Hospitals & Ambulances</span></h2>
                <p className="text-sm text-gray-500">Add or edit hospital information. You can capture location from the browser.</p>
              </div>
              {isEditingHospital && <span className="text-sm text-indigo-600 font-medium">Editing</span>}
            </div>

            <form onSubmit={isEditingHospital ? handleHospitalUpdate : handleHospitalSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Name *</span>
                <input value={hospital.name} onChange={(e) => setHospital({ ...hospital, name: e.target.value })} placeholder="Hospital name" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input value={hospital.email} onChange={(e) => setHospital({ ...hospital, email: e.target.value })} placeholder="contact@hospital.com" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Latitude</span>
                  <input value={hospital.latitude} onChange={(e) => setHospital({ ...hospital, latitude: e.target.value })} placeholder="Latitude" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Longitude</span>
                  <input value={hospital.longitude} onChange={(e) => setHospital({ ...hospital, longitude: e.target.value })} placeholder="Longitude" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <button type="button" onClick={async () => {
                  try {
                    const loc = await getCurrentLocation()
                    setHospital((s) => ({ ...s, latitude: String(loc.latitude), longitude: String(loc.longitude) }))
                    toast.info('Location captured')
                  } catch (err) {
                    toast.error('Unable to capture location')
                  }
                }} className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50">Use current location</button>
                <button type="button" onClick={() => { setHospital((s) => ({ ...s, latitude: '', longitude: '' })); toast.info('Location cleared') }} className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50">Clear location</button>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Address</span>
                <input value={hospital.address} onChange={(e) => setHospital({ ...hospital, address: e.target.value })} placeholder="Street, City" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <div className="grid grid-cols-2 gap-3 items-end">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Ambulance ID</span>
                  <input value={hospital.ambulance_id} onChange={(e) => setHospital({ ...hospital, ambulance_id: e.target.value })} placeholder="Ambulance ID" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={hospital.ambulance_engaged} onChange={(e) => setHospital({ ...hospital, ambulance_engaged: e.target.checked })} />
                  <span className="text-sm text-gray-700">Ambulance engaged</span>
                </label>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                {isEditingHospital ? (
                  <>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Update Hospital</button>
                    <button type="button" onClick={cancelEditHospital} className="px-4 py-2 bg-white border border-gray-200 rounded">Cancel</button>
                  </>
                ) : (
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Hospital</button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2"><Users className="w-5 h-5 text-indigo-600" /><span>Users</span></h2>
                <p className="text-sm text-gray-500">Create or manage application users and driver assignments.</p>
              </div>
              {isEditingUser && <span className="text-sm text-indigo-600 font-medium">Editing</span>}
            </div>

            <form onSubmit={isEditingUser ? handleUserUpdate : handleUserSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Name *</span>
                <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Full name" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email *</span>
                <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="user@example.com" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Password {isEditingUser ? <span className="text-xs text-gray-400">(leave blank to keep)</span> : '*'}</span>
                <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Secure password" type="password" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Role</span>
                <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="ambulance-driver">Ambulance Driver</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input value={user.ambulance_id} onChange={(e) => setUser({ ...user, ambulance_id: e.target.value })} placeholder="Ambulance ID (optional)" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input value={user.mobilenumber} onChange={(e) => setUser({ ...user, mobilenumber: e.target.value })} placeholder="Mobile Number (optional)" className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                {isEditingUser ? (
                  <>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Update User</button>
                    <button type="button" onClick={cancelEditUser} className="px-4 py-2 bg-white border border-gray-200 rounded">Cancel</button>
                  </>
                ) : (
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create User</button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Hospitals</h2>
            <div className="text-sm text-gray-500">Total: {hospitals.length}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            {loadingLists ? (
              <p>Loading hospitals...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-sm text-gray-500">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Ambulance</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((h: any) => (
                      <tr key={h.hospital_id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium">{h.name}</td>
                        <td className="py-3 px-3 text-sm text-gray-600 flex items-center space-x-2"><MapPin className="w-4 h-4 text-gray-400" />{h.latitude && h.longitude ? `${h.latitude}, ${h.longitude}` : '—'}</td>
                        <td className="py-3 px-3">{h.ambulance_id || '—'}</td>
                        <td className="py-3 px-3">
                          {h.ambulance_engaged ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-1" />Engaged</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"><XCircle className="w-4 h-4 mr-1" />Available</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => onEditHospital(h)} className="px-3 py-1 bg-white border border-yellow-200 rounded text-sm flex items-center space-x-1"><Edit className="w-4 h-4 text-yellow-600" /><span>Edit</span></button>
                            <button onClick={() => deleteHospital(h.hospital_id)} className="px-3 py-1 bg-white border border-red-200 rounded text-sm flex items-center space-x-1"><Trash className="w-4 h-4 text-red-600" /><span>Delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {hospitals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">No hospitals yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Users</h2>
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            {loadingLists ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-sm text-gray-500">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u: any) => (
                      <tr key={u.user_id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium">{u.name}</td>
                        <td className="py-3 px-3 text-sm text-gray-600">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-sm ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : u.role === 'ambulance-driver' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-700'}`}>{(u.role || 'user').replace(/-/g, ' ')}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => onEditUser(u)} className="px-3 py-1 bg-white border border-yellow-200 rounded text-sm flex items-center space-x-1"><Edit className="w-4 h-4 text-yellow-600" /><span>Edit</span></button>
                            <button onClick={() => deleteUser(u.user_id)} className="px-3 py-1 bg-white border border-red-200 rounded text-sm flex items-center space-x-1"><Trash className="w-4 h-4 text-red-600" /><span>Delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">No users yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
