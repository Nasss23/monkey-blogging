import React from 'react';
import styled from 'styled-components';

const SignUpPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;
    .logo{
        margin: 0 auto 20px;
    }
    .heading{
        text-align: center;
        color: ${props => props.theme.primary};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 60px;
    }
`;

const SignUpPages = () => {
    return (
        <SignUpPageStyles>
            <div className="container">
                <img srcSet="/logo.png 2x" alt="monkey-blogging" className='logo' />
                <div className="heading">Monkey Blogging</div>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPages;