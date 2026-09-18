import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
    Fuel, 
    Wallet, 
    Gauge, 
    Route, 
    Tag, 
    Zap, 
    RefreshCw, 
    Plus, 
    AlertCircle, 
    Calendar, 
    ChevronRight,
    TrendingUp
} from 'lucide-react';

function Summary() {
    const [user, setUser] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('fuelwise_user');
        let parsedUser = null;

        if (storedUser) {
            try {
                parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }

        fetchSummaryData(parsedUser?.email);
    }, []);

    const fetchSummaryData = async (userEmail) => {
        setLoading(true);
        setError('');

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URI || import.meta.env.VITE_BACKEND_URL;
            const emailParam = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
            const response = await fetch(`${backendUrl}/fuel_summary${emailParam}`);

            const data = await response.json();

            if (response.ok && data.success) {
                setRecords(data.records || []);
            } else {
                setError(data.message || 'Failed to load summary records.');
            }
        } catch (err) {
            console.error('Error fetching summary:', err);
            setError('Unable to connect to server. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fuelwise_token');
        localStorage.removeItem('fuelwise_user');
        setUser(null);
        navigate('/login');
    };

    // Calculate Summary Metrics
    const totalRecords = records.length;

    const totalFuel = records.reduce((acc, curr) => acc + (Number(curr.quantity || curr.fuel) || 0), 0);
    const totalAmount = records.reduce((acc, curr) => acc + (Number(curr.fueling_amount || curr.amount) || 0), 0);
    
    // Calculate total range delta / distance traveled
    const totalDistance = records.reduce((acc, curr) => {
        const delta = (Number(curr.new_range) || 0) - (Number(curr.old_range) || 0);
        return acc + (delta > 0 ? delta : 0);
    }, 0);

    const overallAverageMileage = totalFuel > 0 && totalDistance > 0 
        ? (totalDistance / totalFuel).toFixed(2) 
        : totalFuel > 0 ? (records.reduce((sum, r) => {
            const diff = (Number(r.new_range) || 0) - (Number(r.old_range) || 0);
            const fuelVal = Number(r.quantity || r.fuel) || 0;
            return sum + (diff > 0 && fuelVal > 0 ? diff / fuelVal : 0);
        }, 0) / (totalRecords || 1)).toFixed(2)
        : '0.00';

    const avgFuelPrice = totalFuel > 0 ? (totalAmount / totalFuel).toFixed(2) : '0.00';
    const costPerKm = totalDistance > 0 ? (totalAmount / totalDistance).toFixed(2) : '0.00';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Background glowing effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
            </div>

            <Navbar user={user} onLogout={handleLogout} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10 space-y-8">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Analytics & Logs</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Vehicle Summary Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Comprehensive overview of your fuel consumption, costs, and mileage efficiency metrics.
                        </p>
                    </div>

                    <button
                        onClick={() => fetchSummaryData(user?.email)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm self-start sm:self-center"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Data</span>
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center backdrop-blur-xl">
                        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 text-sm font-medium">Fetching summary analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            
                            {/* Total Fuel */}
                            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                                        <Fuel className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Fuel</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            {totalFuel.toFixed(2)} <span className="text-xs font-medium text-slate-400">L</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Money Spent */}
                            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Money Spent</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Average Mileage Highlight Card */}
                            <div className="bg-linear-to-br from-emerald-950/60 via-slate-900/90 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-lg shadow-emerald-500/5 hover:border-emerald-500/50 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                                        <Gauge className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Avg Mileage</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            {overallAverageMileage} <span className="text-xs font-medium text-emerald-300">km/L</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Distance Tracked */}
                            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                        <Route className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Distance</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            {totalDistance} <span className="text-xs font-medium text-slate-400">km</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Avg Fuel Price */}
                            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Price</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            ₹{avgFuelPrice} <span className="text-xs font-medium text-slate-400">/L</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cost per KM */}
                            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost / KM</p>
                                        <p className="text-xl font-extrabold text-white mt-0.5">
                                            ₹{costPerKm} <span className="text-xs font-medium text-slate-400">/km</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Detailed Table Section */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Fuel Fill-up History</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Showing {totalRecords} total logged records</p>
                                </div>

                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 self-start sm:self-center"
                                >
                                    <Plus className="w-4 h-4 stroke-[2.5]" />
                                    <span>Log New Record</span>
                                </Link>
                            </div>

                            {records.length === 0 ? (
                                <div className="text-center py-16 px-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto mb-3">
                                        <Fuel className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-200">No fuel records logged yet</h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                                        Start recording your fuel fill-ups to track mileage trends and vehicle expenses.
                                    </p>
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
                                    >
                                        <Plus className="w-4 h-4 stroke-[2.5]" />
                                        <span>Log First Fill-Up</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-slate-800">
                                    <table className="w-full text-left text-xs text-slate-300">
                                        <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                                            <tr>
                                                <th className="py-3.5 px-4">#</th>
                                                <th className="py-3.5 px-4">Date</th>
                                                <th className="py-3.5 px-4">Odometer</th>
                                                <th className="py-3.5 px-4">Range (Old → New)</th>
                                                <th className="py-3.5 px-4">Fuel Added</th>
                                                <th className="py-3.5 px-4">Amount</th>
                                                <th className="py-3.5 px-4">Mileage</th>
                                                <th className="py-3.5 px-4">Density</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                                            {records.map((rec, index) => {
                                                const recordFuel = Number(rec.quantity || rec.fuel) || 0;
                                                const recordAmount = rec.fueling_amount ?? rec.amount ?? 0;
                                                const rangeGain = (Number(rec.new_range) || 0) - (Number(rec.old_range) || 0);
                                                const calcMileage = rangeGain > 0 && recordFuel > 0 
                                                    ? (rangeGain / recordFuel).toFixed(2) 
                                                    : '-';
                                                const formattedDate = rec.createdAt 
                                                    ? new Date(rec.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                                    : 'N/A';

                                                return (
                                                    <tr key={rec._id || index} className="hover:bg-slate-800/40 transition-colors">
                                                        <td className="py-3.5 px-4 font-medium text-slate-400">{index + 1}</td>
                                                        <td className="py-3.5 px-4 font-medium text-slate-300 flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                            {formattedDate}
                                                        </td>
                                                        <td className="py-3.5 px-4 font-bold text-white">
                                                            {rec.odometer ? `${rec.odometer} km` : '-'}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                                                                {rec.old_range || 0}
                                                                <ChevronRight className="w-3 h-3 text-slate-500" />
                                                                {rec.new_range || 0} km
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 font-semibold text-teal-400">
                                                            {recordFuel} L
                                                        </td>
                                                        <td className="py-3.5 px-4 font-bold text-emerald-400">
                                                            ₹{recordAmount}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                                calcMileage !== '-'
                                                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                                            }`}>
                                                                {calcMileage} {calcMileage !== '-' ? 'km/L' : ''}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-400">
                                                            {rec.density || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

export default Summary;