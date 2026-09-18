import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Fuel, User, Mail, Lock, Car, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        vehicleName: '',
        fuelType: 'Petrol',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URI || import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Account created successfully! Redirecting...');
                localStorage.setItem('fuelwise_token', data.token);
                localStorage.setItem('fuelwise_user', JSON.stringify(data.user));
                setTimeout(() => {
                    navigate('/');
                }, 1200);
            } else {
                setError(data.message || 'Registration failed. Please check your inputs.');
            }
        } catch (err) {
            console.error('Signup network error:', err);
            setError('Unable to connect to server. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl z-10">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-3">
                        <Fuel className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 text-xs mt-1">Start tracking vehicle mileage and fuel statistics</p>
                </div>

                {/* Banners */}
                {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-2.5 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Vehicle Name & Fuel Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="vehicleName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                Vehicle Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Car className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    id="vehicleName"
                                    name="vehicleName"
                                    placeholder="e.g. Honda City"
                                    value={formData.vehicleName}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fuelType" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                Fuel Type
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-400">
                                    <Fuel className="w-4 h-4" />
                                </div>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Petrol" className="bg-slate-900 text-slate-100">Petrol</option>
                                    <option value="Diesel" className="bg-slate-900 text-slate-100">Diesel</option>
                                    <option value="EV" className="bg-slate-900 text-slate-100">EV</option>
                                    <option value="CNG" className="bg-slate-900 text-slate-100">CNG</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Signup;
