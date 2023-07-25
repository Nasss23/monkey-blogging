import React from 'react';
import styled from 'styled-components';

const DashboardHeadingStyles = styled.div`
  .dashboard-heading {
    margin-bottom: 10px;
  }
`;

const DashboardHeading = ({ title = '', desc = '', children }) => {
  return (

    <div className="flex items-start justify-between mb-10">
      <div>
        <h1 className="dashboard-heading">{title}</h1>
        <p className="dashboard-short-desc">{desc}</p>
      </div>
      {children}
    </div>
  );
};

export default DashboardHeading;
