// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Overview from './overview';
import ModelViewerPage from './modelviewer';
import SiteEvaluation from './siteeval';
//import { auth } from './firebaseConfig';
import { getAuth, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';


const auth = getAuth();

export enum DashboardSection {
  Overview = 'Project Details',
  ModelViewer = '3D Model Viewer',
  SiteEvaluation = 'Site Evaluator',
  TiffViewer = 'Tiff Viewer'
}

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<DashboardSection>(DashboardSection.Overview);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const nav = useNavigate();

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
      nav('/')
    }).catch((error) => {
      // An error happened.
      alert('Bad logout')
    });
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

