import React from 'react';
import styled, { } from 'styled-components';
import Header from '../components/layout/Header';
import HomeBanner from '../module/home/HomeBanner';
import Layout from '../components/layout/Layout';

const HomePageStyles = styled.div`

`

const HomePage = () => {

    return (
        <HomePageStyles>
            <Layout>
                <HomeBanner></HomeBanner>
            </Layout>
        </HomePageStyles>
    );
};

export default HomePage;