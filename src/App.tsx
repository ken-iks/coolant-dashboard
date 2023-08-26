import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import Login from './login';
import SignUp from './signup';

// For now, the default path goes straight to dashboard
// TODO: Fix paths so that the default path '/' goes to the Coolant Landing page
// TODO: Change url so that the base url is Coolant.earth (same as landing page)
// *** The second seems to be very challenging.
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
