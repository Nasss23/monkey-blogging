import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import Field from '../components/field/Field';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { Button } from '../components/button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { IconEyeClose, IconEyeOpen } from '../components/icon';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import { useAuth } from '../contexts/auth-context';
import InputPasswordToggle from '../components/input/InputPasswordToggle';

const schema = yup.object({
    email: yup
        .string()
        .email('Please enter valid your email')
        .required('Please enter your email address'),
    password: yup
        .string()
        .min(8, 'Please password must be ad least 8 characters or greater')
        .required('Please enter your password'),
});

const SignInPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, isSubmitting, errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        const arrayError = Object.values(errors);
        if (arrayError.length > 0) {
            toast.error(arrayError[0]?.message, {
                pauseOnHover: false,
                delay: 100,
            });
        }
    }, [errors]);

    const { userInfo } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Login Page';
        if (userInfo?.email) navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSignIn = async (values) => {
        if (!isValid) return;
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate('/');
    };
    return (
        <AuthenticationPage>
            <form
                className='form'
                onSubmit={handleSubmit(handleSignIn)}
                autoComplete='off'>
                <Field>
                    <Label htmlFor='email'>Email address</Label>
                    <Input
                        name='email'
                        placeholder='Enter your email address'
                        control={control}></Input>
                </Field>
                <Field>
                    <Label htmlFor='password'>Password</Label>
                    <InputPasswordToggle control={control}></InputPasswordToggle>
                </Field>
                <div className='have-account'>
                    You have not had an account{' '}
                    <NavLink to={'/sign-up'}>Register an account</NavLink>
                </div>
                <Button
                    type='submit'
                    style={{
                        width: '100%',
                        maxWidth: 350,
                        margin: '0 auto',
                    }}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}>
                    Sign Up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;
