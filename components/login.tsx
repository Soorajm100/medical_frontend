import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lock, Mail, User, UserCircle, ArrowRight, Sparkles } from 'lucide-react';
import axios from  'axios'; 
import { useAppDispatch } from '@/reduxstore/hooks/hooks';
import { setAuthToken } from '@/reduxstore/slices/isAuthSlice';
import { useRouter } from 'next/router';


const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useAppDispatch(); 

  // Login Form with Formik
  const loginFormik:any = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      // Call your login API logic here
      handleLoginAPI(values);
    },
  });

  // Registration Form with Formik
  const registerFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobilenumber :'' , 
      role: 'user',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ""], 'Passwords must match')
        .required('Confirm password is required'),
      mobilenumber : Yup.string().required('Mobile number is required'), 
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: (values) => {
      // Call your registration API logic here
      handleRegisterAPI(values);
    },
  });


  const router = useRouter(); 
  // API Integration Functions (You will write the logic)
  const handleLoginAPI = async (values:any) => {
    try {
      // Your API call logic here
      console.log('Login Data:', values);
      const data = {
        'email' : values.email,
        'password' : values.password
      }

      console.log("Sending login data:", data);

      const response = await axios.post("http://localhost:5000/api/auth/login", data); 

      const tokenData = response.data 

      console.log("the token ata" , tokenData)
      dispatch(setAuthToken(tokenData))


      // Example success toast
      toast.success('Login successful! Welcome back!', {
        position: 'top-right',
        autoClose: 3000,
        onClose :()=> router.push("/dashboard")
      }); 
    } catch (error) {
      toast.error('Login failed! Please check your credentials.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleRegisterAPI = async (values:any) => {
    try {
      let userData:any = {
        user_id: Date.now(), // Generate unique ID
        name: values.name,
        email: values.email,
        password: values.password, // You should hash this on backend
        role: values.role,
        mobilenumber : values.mobilenumber
      };


      
      // Your API call logic here
      console.log('Registration Data:', userData);

      
      const response = await axios.post("http://localhost:5000/api/auth/register", userData); 

      const respData = response.data; 

      console.log(respData , "the data consoled")
      
      // Example success toast
      toast.success('Registration successful! Please login to continue.', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Switch to login after successful registration
      setTimeout(() => setIsLogin(true), 3500);
    } catch (error) {
      toast.error('Registration failed! Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <ToastContainer />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-white space-y-6 p-8 hidden md:block">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-10 h-10 animate-pulse" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Welcome
              </h1>
            </div>
            <p className="text-2xl font-light leading-relaxed">
              Join our amazing platform and experience seamless service management
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/10 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Excellent Resposne Time</span>
              </div>
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/10 p-4 rounded-lg transform hover:scale-105 transition-all duration-300 delay-100">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Reliability  at its peak</span>
              </div>
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/10 p-4 rounded-lg transform hover:scale-105 transition-all duration-300 delay-200">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Real-time Notifications</span>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500 hover:shadow-purple-500/20">
            {/* Toggle Buttons */}
            <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={loginFormik.handleSubmit} className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                  <p className="text-gray-600">Login to continue your journey</p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.email}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        loginFormik.touched.email && loginFormik.errors.email
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <p className="text-red-500 text-sm">{loginFormik.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.password}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        loginFormik.touched.password && loginFormik.errors.password
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <p className="text-red-500 text-sm">{loginFormik.errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={registerFormik.handleSubmit} className="space-y-5 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join us today and get started</p>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.name}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.name && registerFormik.errors.name
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.name && registerFormik.errors.name && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.email}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.email && registerFormik.errors.email
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.email}</p>
                  )}
                </div>

                  <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="mobilenumber"
                      name="mobilenumber"
                      placeholder="Enter your mobile number"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.mobilenumber}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.mobilenumber && registerFormik.errors.mobilenumber
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.mobilenumber && registerFormik.errors.mobilenumber && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.mobilenumber}</p>
                  )}
                </div>

                {/* Role Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Role</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="role"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.role}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="user">User</option>
                      <option value="ambulance-driver">Ambulance Driver</option>
                      <option value="admin">Admin</option>
                      <option value="hospital-staff">Hospital Staff</option>
                    </select>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.password}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.password && registerFormik.errors.password
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.confirmPassword}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPages;