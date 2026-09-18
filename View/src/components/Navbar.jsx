import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fuel, LayoutDashboard, PlusCircle, LogOut, User, Car } from 'lucide-react';

function Navbar({ user, onLogout }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            localStorage.removeItem('fuelwise_token');
            localStorage.removeItem('fuelwise_user');
            navigate('/login');
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Brand / Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                            <Fuel className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                                FuelWise
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                                Mileage & Efficiency
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                location.pathname === '/'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Record</span>
                        </Link>
                        
                        <Link
                            to="/summary"
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                location.pathname === '/summary'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    </nav>

                    {/* User Info / Logout */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
                                    <User className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="font-semibold text-slate-100">{user.name}</span>
                                    {user.vehicleName && (
                                        <span className="flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-2">
                                            <Car className="w-3 h-3 text-teal-400" />
                                            {user.vehicleName}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Navbar;
