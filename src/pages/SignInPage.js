import React, { useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import Field from '../components/field/Field';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { Button } from '../components/button';

const SignInPage = () => {
    const { handleSubmit, control, formState: { isValid, isSubmitting } } = useForm({
        mode: "onChange"
    })
    // const { userInfo } = useAuth();
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if (!userInfo.email) navigate('/sign-up')
    //     else navigate('/')
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    const handleSignIn = (values) => { }
    return (
        <AuthenticationPage>
            <form
                className='form'
                onSubmit={handleSubmit(handleSignIn)}
                autoComplete='off'
            >
                <Field>
                    <Label htmlFor='email'>Email address</Label>
                    <Input name='email' placeholder="Enter your email address" control={control}></Input>
                </Field>
                <Field>
                    <Label htmlFor='password'>Password</Label>
                    <Input name='password' placeholder="Enter your password " control={control}></Input>
                </Field>
                <Button
                    type='submit' style={{
                        maxWidth: 350,
                        margin: '0 auto'
                    }}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Sign Up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;