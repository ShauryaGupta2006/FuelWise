import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBackendUrl } from '../config/api';
import { 
    Gauge, 
    Fuel, 
    IndianRupee, 
    Scale, 
    ArrowUpRight, 
    ArrowDownLeft, 
    PlusCircle, 
    CheckCircle2, 
    AlertCircle, 
    Sparkles, 
    BarChart3,
    Car
} from 'lucide-react';

function Home() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        odometer: '',
        new_range: '',
        old_range: '',
        fuel: '',
        amount: '',
        density: '',
    });
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('fuelwise_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('fuelwise_token');
        localStorage.removeItem('fuelwise_user');
        setUser(null);
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function addRecord(e) {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });
        setSubmitting(true);

        try {
            const backendUrl = getBackendUrl();
            const payload = {
                ...formData,
                email: user?.email || '',
            };
            const response = await fetch(`${backendUrl}/add_fuel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success === true) {
                setStatusMsg({ type: 'success', text: "Fuel record logged successfully!" });
                setFormData({ odometer: '', new_range: '', old_range: '', fuel: '', amount: '', density: '' });
            } else {
                setStatusMsg({ type: 'error', text: data.message || "Failed to add record." });
            }
        } catch (err) {
            console.error("Error adding fuel record:", err);
            setStatusMsg({ type: 'error', text: "Failed to connect to backend server." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Background glowing effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
            </div>

            <Navbar user={user} onLogout={handleLogout} />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 z-10">
                
                {/* Hero / Greeting Header */}
                <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Fuel Tracking Assistant</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Log Fill-Up & Calculate Mileage
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Record your odometer and fuel details to automatically update vehicle metrics.
                        </p>
                    </div>

                    {user && (
                        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <Car className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 font-medium">Active Vehicle</p>
                                <p className="text-sm font-bold text-slate-200">{user.vehicleName || 'My Vehicle'}</p>
                                <p className="text-[10px] text-emerald-400 font-semibold uppercase">{user.fuelType || 'Petrol'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Banners */}
                {statusMsg.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
                        statusMsg.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                            : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                        {statusMsg.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{statusMsg.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Fuel Input Form */}
                    <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <PlusCircle className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-lg font-bold text-white">Add New Fuel Record</h2>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">* Required fields</span>
                        </div>

                        <form onSubmit={addRecord} className="space-y-5">
                            
                            {/* Odometer */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Odometer Reading (km) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Gauge className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        name="odometer"
                                        placeholder="e.g. 45200"
                                        value={formData.odometer}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Range Fields Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                        Previous Range (km) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <ArrowDownLeft className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="old_range"
                                            placeholder="e.g. 45"
                                            value={formData.old_range}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                        New Range After Fuel (km) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            name="new_range"
                                            placeholder="e.g. 450"
                                            value={formData.new_range}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fuel & Amount Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                        Fuel Quantity (Liters) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-400">
                                            <Fuel className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="fuel"
                                            placeholder="e.g. 35.5"
                                            value={formData.fuel}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                        Billing Amount (₹) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                                            <IndianRupee className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="amount"
                                            placeholder="e.g. 3400"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Density */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Fuel Density (kg/m³) <span className="text-slate-500 text-[11px] font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        name="density"
                                        placeholder="e.g. 745.2"
                                        value={formData.density}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-2 py-3 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Logging Record...</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                        <span>Save Fuel Fill-Up</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Quick Tips & Navigation Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-emerald-400" />
                                Dashboard Shortcut
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                View your overall average mileage, cost per km, and lifetime fuel expenses.
                            </p>
                            <Link
                                to="/summary"
                                className="block w-full text-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                            >
                                Open Summary Dashboard →
                            </Link>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                                💡 Mileage Calculation Tip
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
                                <li>Always enter accurate odometer readings from your cluster.</li>
                                <li>Range gain is calculated as (<span className="text-emerald-400 font-semibold">New Range - Old Range</span>).</li>
                                <li>Keeping records up to date ensures accurate fuel efficiency stats over time.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default Home;