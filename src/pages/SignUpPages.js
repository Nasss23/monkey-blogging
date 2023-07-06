import React from 'react';
import styled from 'styled-components';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { useForm } from 'react-hook-form'
import { IconEyeClose } from '../components/icon';

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

    .form{
        max-width: 600px;
        margin: 0 auto;
    }
`;

const SignUpPages = () => {
    const { control, handleSubmit, formState: {
        errors,
        isValid,
        isSubmitting
    } } = useForm();
    const handleSignUp = (e) => {
        console.log(e)
    }
    return (
        <SignUpPageStyles>
            <div className="container">
                <img srcSet="/logo.png 2x" alt="monkey-blogging" className='logo' />
                <div className="heading">Monkey Blogging</div>
                <form className='form' onSubmit={handleSubmit(handleSignUp)}>
                    <div className="field">
                        <Label htmlFor="fullname">
                            Fullname
                        </Label>
                        <Input
                            type="text"
                            name='fullname'
                            placeholder='Please enter your fullname'
                            control={control}
                        />
                    </div>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPages;