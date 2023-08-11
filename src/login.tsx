// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { auth } from './firebaseConfig';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('Blah')
      nav('./dashboard')
    })
    .catch((error) => {
      setEmail('');
      setPassword('');
      alert("Email or password is incorrect!");
      console.log(error.message)
    });
  
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleSignUp = () => {
    nav('./signup')
  };


  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        <div onSubmit = {handleLogin} onKeyDown={handleKeyDown}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <button type="submit" onClick={handleLogin}>
          Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


/* 
All accounts need to be name@coolant.earth

Test login
Email: pilot@coolant.earth
Pword: Pilot@123

Add this to Login if you want to sign up another user
<button type="submit" onClick={handleSignUp} disabled>
  Sign Up
</button>
*/