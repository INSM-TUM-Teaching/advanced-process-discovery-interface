import React, { useState } from 'react';
import TabButton from './TabButton';
import NewProjectForm from './NewProjectForm';
import OpenProjectForm from './OpenProjectForm';

const ProjectTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'open'>('new');

  return (
    <div>
      <div className="flex border-b mb-4">
        <TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
          New
        </TabButton>
        <TabButton active={activeTab === 'open'} onClick={() => setActiveTab('open')}>
          Open
        </TabButton>
      </div>
      {activeTab === 'new' ? <NewProjectForm /> : <OpenProjectForm />}
    </div>
  );
};

export default ProjectTabs;