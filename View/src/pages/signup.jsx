import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
            const backendUrl = import.meta.env.VITE_BACKEND_URI;
            const response = await fetch(`${backendUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Account created successfully! Redirecting to login...');
                localStorage.setItem('fuelwise_token', data.token);
                localStorage.setItem('fuelwise_user', JSON.stringify(data.user));
                setTimeout(() => {
                    navigate('/');
                }, 1500);
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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">⛽ FuelWise</div>
                    <h2>Create Account</h2>
                    <p>Start tracking your vehicle efficiency today</p>
                </div>

                {error && <div className="auth-alert alert-error">{error}</div>}
                {success && <div className="auth-alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="vehicleName">Vehicle Name</label>
                            <input
                                type="text"
                                id="vehicleName"
                                name="vehicleName"
                                placeholder="e.g. Honda City"
                                value={formData.vehicleName}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fuelType">Fuel Type</label>
                            <select
                                id="fuelType"
                                name="fuelType"
                                value={formData.fuelType}
                                onChange={handleChange}
                                className="form-input form-select"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="EV">EV</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
