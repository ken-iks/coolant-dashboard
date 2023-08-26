import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import './login.css';
import { useNavigate } from 'react-router-dom'; 


const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate(); // Get the history object from react-router-dom

  const handleSignin = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up successfully
        var user = userCredential.user;
        // Redirect to the dashboard after successful sign-up
        alert('success');
        nav('/dashboard');
      })
      .catch((error) => {
        console.error('Sign-up error:', error.message);
        alert('Sign-up failed. Please try again.');
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSignin();
    }
  };

  const handleLogIn = () => {
    nav('/')
  };


  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Sign Up</h2>
        <div onSubmit={handleSignin}> {/* Use handleLogin for form submission */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit">
            Sign Up
          </button>
        </div>
        <button type="submit" onClick={handleLogIn}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;