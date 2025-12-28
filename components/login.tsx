import React, { useState, useRef, useEffect } from 'react';
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
  const [videoStatus, setVideoStatus] = useState<'idle'|'loaded'|'error'>('idle')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showRaw, setShowRaw] = useState(false)
  const [videoInfo, setVideoInfo] = useState({ width: 0, height: 0, currentTime: 0, duration: 0, paused: true, src: '' })

  // About / Portfolio info and modal state
  const [showAboutModal, setShowAboutModal] = useState(false);
  const aboutInfo = {
    displayName: 'Dhanman',
    title: 'Frontend / Full-stack Developer',
    bio: 'Building healthcare and emergency response interfaces and dashboards. Click below to visit my portfolio.'
  };
  const openPortfolio = () => {
    if (typeof window !== 'undefined') {
      window.open('https://portfolio-ten-rouge-16.vercel.app/', '_blank', 'noopener,noreferrer');
    }
  };

  const sampleAccounts = [
    { user_id: 1766905312417, name: 'dhanman', email: 'dhanman@sample.com', password: '123456789', role: 'admin' },
    { user_id: 1762153373169, name: 'Ramesh', email: 'ramesh123@sample.com', password: '123456789', role: 'ambulance-driver', ambulance_id: 'AMB004-B' },
    { user_id: 1766928790748, name: 'SampleUser', email: 'sample@gmail.com', password: '123456789', role: 'user' },
  ];

  const [sampleIndex, setSampleIndex] = useState(0);
  const [showSamples, setShowSamples] = useState(true);
  const [isSamplesCollapsed, setIsSamplesCollapsed] = useState(false);

  useEffect(() => {
    if (!showSamples || isSamplesCollapsed) return;
    const id = setInterval(() => setSampleIndex((i) => (i + 1) % sampleAccounts.length), 5000);
    return () => clearInterval(id);
  }, [showSamples, isSamplesCollapsed]);

  const autofillSample = (index:number) => {
    const acc = sampleAccounts[index];
    if (!acc) return;
    loginFormik.setValues({ email: acc.email, password: acc.password });
    toast.info(`Autofilled ${acc.email}`, { autoClose: 1200 });
  };

  const copySample = async (index:number) => {
    const acc = sampleAccounts[index];
    if (!acc) return;
    const text = `Email: ${acc.email}\nPassword: ${acc.password}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast.success('Copied credentials to clipboard');
    } catch (e) {
      toast.error('Unable to copy credentials');
    }
  };

  const useAndLogin = (index:number) => {
    const acc = sampleAccounts[index];
    if (!acc) return;
    loginFormik.setValues({ email: acc.email, password: acc.password });
    setTimeout(() => loginFormik.submitForm(), 120);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const update = () => setVideoInfo({ width: v.videoWidth, height: v.videoHeight, currentTime: Math.floor(v.currentTime), duration: Math.floor(v.duration || 0), paused: v.paused, src: v.currentSrc || v.src || '' })
    const onLoaded = () => { setVideoStatus('loaded'); update() }
    const onErr = () => { setVideoStatus('error'); update() }
    const onTime = () => update()
    const onPlay = () => update()
    const onPause = () => update()

    v.addEventListener('loadeddata', onLoaded)
    v.addEventListener('error', onErr)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    // initial update
    update()
    return () => {
      v.removeEventListener('loadeddata', onLoaded)
      v.removeEventListener('error', onErr)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [videoRef])

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

      const response = await axios.post("https://medical-backend-dbt2.onrender.com/api/auth/login", data); 

      // Normalize API response shape -- some backends wrap data under `data`
      const tokenData = response.data?.data || response.data || {};
      console.log("login response:", tokenData);

      // Save to redux
      dispatch(setAuthToken(tokenData));

      // Navigate to dashboard immediately (don't rely on toast onClose)
      router.push('/dashboard');

      // Show success toast
      toast.success('Login successful! Redirecting to dashboard...', {
        position: 'top-right',
        autoClose: 3000,
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

      
      const response = await axios.post("https://medical-backend-dbt2.onrender.com/api/auth/register", userData); 

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Top Navbar */}
      <div className="fixed top-4 left-0 right-0 z-40 px-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-white" />
            <span className="text-white font-semibold text-lg">MedicFlow</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a className="text-white/90 hover:underline cursor-pointer">Features</a>
            <a className="text-white/90 hover:underline cursor-pointer">Hospitals</a>
            <a className="text-white/90 hover:underline cursor-pointer">Drivers</a>
            <a onClick={() => setShowAboutModal(true)} className="text-white/90 hover:underline cursor-pointer">About</a>
            <button onClick={() => setIsLogin(true)} className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow">Get Started</button>
          </div>
        </nav>
      </div>

      {/* Background video (place your file at /public/videos/login.mp4) */}
      <div className="fixed inset-0 -z-20">
        <video
          ref={videoRef}
          src="/login.mp4"
          loop
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          id="bg-video"
          onLoadedData={() => setVideoStatus('loaded')}
          onError={() => setVideoStatus('error')}
          style={{ filter: 'brightness(0.98) contrast(1.02) saturate(1.06)' }}
        >
          {/* fallback source */}
          <source src="/login.mp4" type="video/mp4" />
          {/* Fallback message if video is not supported */}
          Your browser does not support the video tag.
        </video>
        {/* Subtle overlay to keep forms readable (lighter so video shows through) */}
        <div className={`absolute inset-0 ${showRaw ? 'bg-transparent' : 'bg-black/6'}`} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-white space-y-6 p-8 hidden md:block">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-10 h-10 text-white" />
              <h1 className="text-5xl font-bold text-white">
                Welcome
              </h1>
            </div>
            <p className="text-2xl font-light leading-relaxed">
              Join our amazing platform and experience seamless service management
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 p-4 rounded-lg transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Excellent Resposne Time</span>
              </div>
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 p-4 rounded-lg transform hover:scale-105 transition-all duration-300 delay-100">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Reliability  at its peak</span>
              </div>
              <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 p-4 rounded-lg transform hover:scale-105 transition-all duration-300 delay-200">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-lg">Real-time Notifications</span>
              </div>

              {/* Badges row */}
              <div className="mt-8 flex space-x-4">
                <div className="bg-white/10 text-white px-4 py-2 rounded-lg">120+ Hospitals</div>
                <div className="bg-white/10 text-white px-4 py-2 rounded-lg">99% Uptime</div>
                <div className="bg-white/10 text-white px-4 py-2 rounded-lg">24/7 Support</div>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="backdrop-blur-sm bg-black/50 rounded-3xl shadow-lg p-8 md:p-12 transform transition-all duration-500 hover:shadow-2xl border border-white/10 text-white">
            {/* Toggle Buttons */}
            <div className="flex space-x-2 mb-8 bg-white/5 p-2 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-indigo-600 text-white shadow md:shadow-lg'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-indigo-600 text-white shadow md:shadow-lg'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={loginFormik.handleSubmit} className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                  <p className="text-white/80">Login to continue your journey</p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.email}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        loginFormik.touched.email && loginFormik.errors.email
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                  </div>
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <p className="text-red-500 text-sm">{loginFormik.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.password}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        loginFormik.touched.password && loginFormik.errors.password
                          ? 'border-red-500'
                          : 'border-white/20'
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
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={registerFormik.handleSubmit} className="space-y-5 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-white/80">Join us today and get started</p>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.name}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.name && registerFormik.errors.name
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.name && registerFormik.errors.name && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.email}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.email && registerFormik.errors.email
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.email}</p>
                  )}
                </div>

                  <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Mobile Number</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="mobilenumber"
                      name="mobilenumber"
                      placeholder="Enter your mobile number"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.mobilenumber}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.mobilenumber && registerFormik.errors.mobilenumber
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.mobilenumber && registerFormik.errors.mobilenumber && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.mobilenumber}</p>
                  )}
                </div>

                {/* Role Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Select Role</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <select
                      name="role"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.role}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-black/60 text-black border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 appearance-none"
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
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.password && registerFormik.errors.password
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                  </div>
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <p className="text-red-500 text-sm">{registerFormik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      value={registerFormik.values.confirmPassword}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 placeholder:text-white/60 text-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-white/20'
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
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 w-full text-center text-xs text-white/80">
        {videoStatus === 'error' ? (
          <span className="text-sm text-red-300">Background video not found. Place a file at <code className="bg-black/30 px-2 py-1 rounded">/bg-video.mp4</code> or <code className="bg-black/30 px-2 py-1 rounded">/videos/login.mp4</code></span>
        ) : videoStatus === 'loaded' ? (
          <span className="text-sm text-green-200">Background video is active</span>
        ) : (
          <span className="text-sm">Place a background video at <code className="bg-black/30 px-2 py-1 rounded">/bg-video.mp4</code> (MP4, muted)</span>
        )}
      </div>

      {/* About modal (opens from navbar) */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAboutModal(false)} />
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 text-gray-900 shadow-lg mx-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">About {'Sooraj M'}</h3>
                <p className="text-sm text-gray-600 mt-2">{'Software Engineer'}</p>
                <p className="mt-3 text-sm text-gray-700">{aboutInfo.bio}</p>
                <p className="mt-2 text-xs text-gray-500">Tip: use the Test Accounts (top-left) to quickly test the app without signing up.</p>
              </div>
              <button onClick={() => setShowAboutModal(false)} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => openPortfolio()} className="px-4 py-2 bg-indigo-600 text-white rounded">Visit Portfolio</button>
              <button onClick={() => setShowAboutModal(false)} className="px-4 py-2 bg-white border rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Sample accounts collapsible widget (top-left, hidden on small screens) */}
      {showSamples && (
        <div className="fixed left-6 top-20 z-50 hidden md:block">
          <div className={`transition-all duration-300 ${isSamplesCollapsed ? 'w-12 p-2' : 'w-80 p-3'} bg-black/60 text-white rounded-lg shadow-lg`}> 
            {isSamplesCollapsed ? (
              <div className="flex items-center justify-center h-16">
                <button onClick={() => setIsSamplesCollapsed(false)} aria-label="Expand samples" className="w-8 h-8 flex items-center justify-center rounded bg-white/10">▶</button>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-white/80">Test Accounts</div>
                    <div className="font-semibold mt-1">{sampleAccounts[sampleIndex].name} <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">{sampleAccounts[sampleIndex].role.replace(/-/g,' ')}</span></div>
                    <div className="text-xs mt-2"><span className="font-mono">{sampleAccounts[sampleIndex].email}</span></div>
                    <div className="text-xs"><span className="font-mono">{sampleAccounts[sampleIndex].password}</span></div>
                  </div>
                  <div className="ml-3 flex flex-col space-y-2">
                    <button onClick={() => autofillSample(sampleIndex)} className="px-2 py-1 bg-indigo-600 rounded text-sm">Autofill</button>
                    <button onClick={() => useAndLogin(sampleIndex)} className="px-2 py-1 bg-green-600 rounded text-sm">Use &amp; Login</button>
                    <button onClick={() => copySample(sampleIndex)} className="px-2 py-1 bg-white/10 rounded text-sm">Copy</button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-1">{sampleAccounts.map((_,i) => (<div key={i} className={`w-2 h-2 rounded-full ${i===sampleIndex? 'bg-indigo-500' : 'bg-white/30'}`}></div>))}</div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setIsSamplesCollapsed(true)} className="text-xs text-white/60">Collapse</button>
                    <button onClick={() => setSampleIndex((i) => (i - 1 + sampleAccounts.length) % sampleAccounts.length)} className="text-xs text-white/60">◀</button>
                    <button onClick={() => setSampleIndex((i) => (i + 1) % sampleAccounts.length)} className="text-xs text-white/60">▶</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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