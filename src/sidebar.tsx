// Sidebar.tsx
import React from 'react';
import { DashboardSection } from './dashboard';
import { auth } from './firebaseConfig';

const user = auth.currentUser;
const name = user?.email?.split('@')[0];

interface SidebarProps {
  selectedSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionChange }) => {
  const sections = [DashboardSection.Overview, DashboardSection.ModelViewer, 
     DashboardSection.SiteEvaluation, DashboardSection.Settings];
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
