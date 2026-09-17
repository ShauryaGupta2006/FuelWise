import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="summary-page">
            <header className="navbar">
                <div className="nav-brand">
                    <span className="brand-logo">⛽</span>
                    <span className="brand-name">FuelWise</span>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Add Record</Link>
                    <Link to="/summary" className="nav-link active">Summary Dashboard</Link>
                </div>
                <div className="nav-user">
                    {user ? (
                        <div className="user-profile">
                            <span className="user-welcome">👋 Welcome, <strong>{user.name}</strong> ({user.vehicleName})</span>
                            <button onClick={handleLogout} className="btn-secondary btn-sm">Logout</button>
                        </div>
                    ) : (
                        <div className="nav-auth-buttons">
                            <Link to="/login" className="btn-secondary btn-sm">Log In</Link>
                            <Link to="/signup" className="btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="summary-container">
                <div className="summary-header">
                    <div>
                        <h1>Vehicle Summary Dashboard</h1>
                        <p>Comprehensive overview of your fuel consumption, costs, and mileage analytics.</p>
                    </div>
                    <button onClick={() => fetchSummaryData(user?.email)} className="btn-secondary btn-sm refresh-btn">
                        🔄 Refresh Data
                    </button>
                </div>

                {error && <div className="status-banner alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-spinner-card">
                        <div className="spinner"></div>
                        <p>Loading your summary metrics...</p>
                    </div>
                ) : (
                    <>
                        {/* KPI Metrics Grid */}
                        <div className="kpi-grid">
                            <div className="kpi-card">
                                <div className="kpi-icon">⛽</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Total Fuel Filled</span>
                                    <span className="kpi-value">{totalFuel.toFixed(2)} <small>L</small></span>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-icon">💰</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Total Money Spent</span>
                                    <span className="kpi-value">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="kpi-card highlight">
                                <div className="kpi-icon">📊</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Average Mileage</span>
                                    <span className="kpi-value">{overallAverageMileage} <small>km/L</small></span>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-icon">🛣️</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Distance Tracked</span>
                                    <span className="kpi-value">{totalDistance} <small>km</small></span>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-icon">🏷️</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Avg Fuel Price</span>
                                    <span className="kpi-value">₹{avgFuelPrice} <small>/L</small></span>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-icon">⚡</div>
                                <div className="kpi-info">
                                    <span className="kpi-label">Avg Cost / KM</span>
                                    <span className="kpi-value">₹{costPerKm} <small>/km</small></span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Log Table */}
                        <div className="card table-card">
                            <div className="table-header-flex">
                                <h2>Fuel Log History ({totalRecords} Logs)</h2>
                                <Link to="/" className="btn-primary btn-sm add-record-btn">+ Add Fuel Record</Link>
                            </div>

                            {records.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📝</div>
                                    <h3>No fuel records logged yet</h3>
                                    <p>Start tracking your vehicle fill-ups to calculate mileage and total costs.</p>
                                    <Link to="/" className="btn-primary" style={{ width: 'auto', display: 'inline-block', padding: '10px 24px' }}>
                                        Log First Fill-Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="summary-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Date</th>
                                                <th>Odometer</th>
                                                <th>Range (Old ➔ New)</th>
                                                <th>Fuel Added</th>
                                                <th>Amount Spent</th>
                                                <th>Calculated Mileage</th>
                                                <th>Density</th>
                                            </tr>
                                        </thead>
                                        <tbody>
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
                                                    <tr key={rec._id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{formattedDate}</td>
                                                        <td><strong>{rec.odometer ? `${rec.odometer} km` : '-'}</strong></td>
                                                        <td>
                                                            <span className="range-badge">
                                                                {rec.old_range || 0} ➔ {rec.new_range || 0} km
                                                            </span>
                                                        </td>
                                                        <td>{recordFuel} L</td>
                                                        <td><strong className="amount-text">₹{recordAmount}</strong></td>
                                                        <td>
                                                            <span className={`mileage-badge ${calcMileage !== '-' ? 'positive' : ''}`}>
                                                                {calcMileage} {calcMileage !== '-' ? 'km/L' : ''}
                                                            </span>
                                                        </td>
                                                        <td>{rec.density || '-'}</td>
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