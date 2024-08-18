import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Services/firebaseAuth'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onLoggedIn = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/todo');
            }
        });
    };

    useEffect(() => {
        onLoggedIn();
    }, []);
    
    const handelLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User Login Successfully");
        } catch (error) {
            setError(error.message);
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="row mt-5 justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-lg p-4" style={{ borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                    <h1 className="fw-bold text-center mb-4" style={{ color: '#007bff' }}>Login</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        className="form-control mt-3 border-0 shadow-sm"
                        style={{ borderRadius: '20px' }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control mt-3 border-0 shadow-sm"
                        style={{ borderRadius: '20px' }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="mt-4 btn btn-primary btn-block"
                        style={{ backgroundColor: '#28a745', borderColor: '#28a745', borderRadius: '20px' }}
                        onClick={handelLogin}
                    >
                        Login
                    </button>
                    {error && <p className="text-danger text-center mt-3">{error}</p>}
                    <p
                        onClick={goToRegister}
                        className="btn btn-link d-block text-center mt-4"
                        style={{ color: '#17a2b8' }}
                    >
                        Create an Account? Register here
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
