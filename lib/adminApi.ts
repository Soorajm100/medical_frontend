import axios from 'axios'

export const fetchHospitals = async (headers = {}) => {
  const res = await axios.get('https://medical-backend-dbt2.onrender.com/api/admin/hospitals', { headers })
  return res.data?.hospitals || res.data || []
}

export const fetchUsers = async (headers = {}) => {
  const res = await axios.get('https://medical-backend-dbt2.onrender.com/api/admin/users', { headers })
  return res.data?.users || res.data || []
}

export const fetchAdminStats = async (headers = {}) => {
  const [hospitals, users] = await Promise.all([fetchHospitals(headers), fetchUsers(headers)])
  return {
    hospitals: hospitals.length,
    users: users.length,
    ambulances: hospitals.filter((h:any) => !!h.ambulance_id).length,
  }
}
