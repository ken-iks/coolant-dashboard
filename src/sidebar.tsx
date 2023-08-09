// Sidebar.tsx
import React from 'react';
import { DashboardSection } from './dashboard';
import GetUser from './getuser';
import { useState, useEffect } from 'react';
import { getAuth, User } from 'firebase/auth';
import { auth } from './firebaseConfig'
import firebase from 'firebase/compat';
import useGetUser from './getuser';



interface SidebarProps {
  selectedSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionChange }) => {
  const sections = [DashboardSection.Overview, DashboardSection.ModelViewer, 
     DashboardSection.SiteEvaluation, DashboardSection.Settings];

  const name = useGetUser();

  return (
    <div className="sidebar">
      <h2>{name}'s Dashboard</h2>
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            className={selectedSection === section ? 'active' : ''}
            onClick={() => onSectionChange(section)}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
