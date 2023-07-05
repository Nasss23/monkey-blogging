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
    .field{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 20px;
    }
    .label{
        ${props => props.theme.grayDark};
        font-weight: 600;
        cursor: pointer;
    }
    .input{
        width: 100%;
        padding: 20px;
        background-color: ${props => props.theme.grayLight};
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s linear;
        border: 1px solid transparent;
    }
    .input:focus{
        background-color: white;
        border-color: ${props => props.theme.primary};;
    }
    ::-webkit-input-placeholder{
    color: #84878b;
    }
    ::-moz-input-placeholder{
    color: #84878b;
    }
    .form{
        max-width: 600px;
        margin: 0 auto;
    }
`;

const SignUpPages = () => {
    return (
        <SignUpPageStyles>
            <div className="container">
                <img srcSet="/logo.png 2x" alt="monkey-blogging" className='logo' />
                <div className="heading">Monkey Blogging</div>
                <form className='form'>
                    <div className="field">
                        <label htmlFor="fullname" className="label">
                            Fullname
                        </label>
                        <input
                            id='fullname'
                            type="text"
                            className="input"
                            placeholder='Please enter your fullname'
                        />
                    </div>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPages;