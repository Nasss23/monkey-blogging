import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Label } from '../components/label';
import Input from '../components/input/Input';
import { useForm } from 'react-hook-form'
import { IconEyeClose, IconEyeOpen } from '../components/icon';
import Field from '../components/field/Field';
import { Button } from '../components/button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import AuthenticationPage from './AuthenticationPage';



const schema = yup.object({
    fullname: yup
        .string()
        .required("Please enter your name"),
    email: yup
        .string()
        .email("Please enter valid your email")
        .required("Please enter your email address"),
    password: yup
        .string()
        .min(8, "Please password must be ad least 8 characters or greater")
        .required("Please enter your password")
})

const SignUpPage = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isValid,
            isSubmitting
        },
        watch,
        reset
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const handleSignUp = async (values) => {
        if (!isValid) return;
        console.log(values)
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve();
        //     }, 5000)
        // })
        const user = await createUserWithEmailAndPassword(auth, values.email, values.password)
        await updateProfile(auth.currentUser, {
            displayName: values.fullname
        })
        const colRef = collection(db, 'user');
        await addDoc(colRef, {
            fullname: values.fullname,
            email: values.email,
            password: values.password
        })
        toast.success('Register successfully!!!')
        navigate("/")
    }
    const [togglePassword, setTogglePassword] = useState(false);
    useEffect(() => {
        const arrayError = Object.values(errors)
        if (arrayError.length > 0) {
            toast.error(arrayError[0]?.message, {
                pauseOnHover: false,
                delay: 100
            })
        }
    }, [errors]);
    useEffect(() => {
        document.title = "Register Page"
    })
    return (
        <AuthenticationPage>
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
                <div className="have-account">You already have an account <NavLink to={"/sign-in"}>Login</NavLink></div>
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

export default SignUpPage;