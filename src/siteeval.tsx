import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import displayForm from './displayForm';
import DisplayForm from './displayForm';
import './siteeval.css';


const SiteEvaluation: React.FC = () => {

  return (
    <div>
      <DisplayForm.DisplayForm />
    </div>
  );
}



export default SiteEvaluation;