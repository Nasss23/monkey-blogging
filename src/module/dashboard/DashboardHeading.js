import React from 'react';
import styled from 'styled-components';

const DashboardHeadingStyles = styled.div`
  .dashboard-heading {
    margin-bottom: 10px;
  }
`;

const DashboardHeading = ({ title = '', desc = '' }) => {
  return (

    <DashboardHeadingStyles className='mb-10'>
      <h1 className='dashboard-heading'>{title}</h1>
      <p className='dashboard-short-desc'>{desc}</p>
    </DashboardHeadingStyles>
  );
};

export default DashboardHeading;
