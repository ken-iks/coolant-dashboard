import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Overview from './overview';
import ModelViewerPage from './modelviewer';
import SiteEvaluation from './siteeval';
import { getAuth, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}


export enum DashboardSection {
  Overview = 'Project Details',
  ModelViewer = '3D Model Viewer',
  SiteEvaluation = 'Site Evaluator',
}

const Dashboard: React.FC = () => {

  const [selectedSection, setSelectedSection] = useState<DashboardSection>(DashboardSection.Overview);
  const nav = useNavigate();

  const auth = getAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSectionChange = (section: DashboardSection) => {
    setSelectedSection(section);
  };


  
  const renderContent = () => {
    switch (selectedSection) {
      case DashboardSection.Overview:
        return <Overview />;
        case DashboardSection.ModelViewer:
        return <ModelViewerPage />;
      case DashboardSection.SiteEvaluation:
        return <SiteEvaluation />;
      default:
        return null;
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      nav('/login')
    }).catch((error) => {
      // An error happened.
      alert('Bad logout')
    });
  }

  if (!authChecked) {
    return <LoadingComponent />;
  }
  if (!isAuthenticated) {
    nav('/login');
  }
  return (
    <div>
      <div className="dashboard-container">
        <div className='sidebar'>
        <Sidebar selectedSection={selectedSection} onSectionChange={handleSectionChange} />
        </div>
        <div className="main-content">
          {renderContent()}
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;

