import React, { useState } from 'react';
import styled from 'styled-components';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { useForm } from 'react-hook-form'
import { IconEyeClose, IconEyeOpen } from '../components/icon';
import Field from '../components/field/Field';

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
    const [togglePassword, setTogglePassword] = useState(false);

    return (
        <SignUpPageStyles>
            <div className="container">
                <img srcSet="/logo.png 2x" alt="monkey-blogging" className='logo' />
                <div className="heading">Monkey Blogging</div>
                <form className='form' onSubmit={handleSubmit(handleSignUp)} autoComplete='off'>
                    <Field>
                        <Label htmlFor="fullname">
                            Fullname
                        </Label>
                        <Input
                            type="text"
                            name='fullname'
                            placeholder='Please enter your fullname'
                            control={control}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <Input
                            type="email"
                            name='email'
                            placeholder='Please enter your email address'
                            control={control}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Input

                            type={togglePassword ? 'text' : 'password'}
                            name='password'
                            placeholder='Please enter your password'
                            control={control}
                        >
                            {!togglePassword ? <IconEyeClose
                                onClick={() => setTogglePassword(true)}
                            ></IconEyeClose> : <IconEyeOpen
                                onClick={() => setTogglePassword(false)}
                            ></IconEyeOpen>
                            }
                        </Input>
                    </Field>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPages;