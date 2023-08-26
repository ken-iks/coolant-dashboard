// Sidebar.tsx
import React from 'react';
import { DashboardSection } from './dashboard';
import useGetUser from './getuser';
import "./sidebar.css";



interface SidebarProps {
  selectedSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionChange }) => {
  const sections = [DashboardSection.Overview, DashboardSection.ModelViewer, 
     DashboardSection.SiteEvaluation];

  const nam = useGetUser();
  const name = nam.charAt(0).toUpperCase() + nam.slice(1);

  return (
    <div className="sidebar">
      <img src={`${process.env.PUBLIC_URL}/bumiterra-logo.png`} className='logo' />
      <div className='extra-words-on-sidebar'>
      <h1>{name}</h1>
      <h3> Carbon made easy </h3>
      <h4> Built and designed in collaboration with Coolant. </h4>
      </div >
      <div className='sidebar-options'>
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
    </div>
  );
};

export default Sidebar;
