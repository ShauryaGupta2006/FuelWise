import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    const [statusMsg, setStatusMsg] = useState('');
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
        setStatusMsg('');
        console.log(formData);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URI || import.meta.env.VITE_BACKEND_URL;
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
                setStatusMsg("Record added successfully!");
                setFormData({ odometer: '', new_range: '', old_range: '', fuel: '', amount: '', density: '' });
            } else {
                setStatusMsg(data.message || "Failed to add record.");
            }
        } catch (err) {
            console.error("Error adding fuel record:", err);
            setStatusMsg("Failed to add record.");
        }
    }

    return (
        <div className="home-container">
            <header className="navbar">
                <div className="nav-brand">
                    <span className="brand-logo">⛽</span>
                    <span className="brand-name">FuelWise</span>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link active">Add Record</Link>
                    <Link to="/summary" className="nav-link">Summary Dashboard</Link>
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

            <main className="home-content">
                <div className="hero-section">
                    <h1>FuelWise Tracker</h1>
                    <p>Log fuel fill-ups and monitor your vehicle's mileage efficiency.</p>
                </div>

                <div className="card form-card">
                    <h2>Add Fuel Record</h2>
                    {statusMsg && <div className="status-banner">{statusMsg}</div>}
                    
                    <form onSubmit={addRecord} className="fuel-form">
                        <div className="form-group">
                            <label>Odometer Reading (km)</label>
                            <input
                                type="number"
                                name="odometer"
                                placeholder="e.g. 45200"
                                value={formData.odometer}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Range After Fuel (km)</label>
                            <input
                                type="number"
                                name="new_range"
                                placeholder="e.g. 45200"
                                value={formData.new_range}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>previous range (km)</label>
                            <input
                                type="number"
                                name="old_range"
                                placeholder="e.g. 45200"
                                value={formData.old_range}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Fuel Quantity (L)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="fuel"
                                placeholder="e.g. 35.5"
                                value={formData.fuel}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Billing Amount (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount"
                                placeholder="e.g. 3400"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Density (kg/m³)</label>
                            <input
                                type="text"
                                name="density"
                                placeholder="e.g. 745.2"
                                value={formData.density}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-block">Add Record</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Home;