import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Field, FieldCheckboxes } from 'components/field';
import ImageUpload from 'components/image/ImageUpload';
import { Input } from 'components/input';
import { Label } from 'components/label';
import DashboardHeading from 'drafts/DashboardHeading';
import { db } from 'firebase-app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useFirebaseImage from 'hooks/useFirebaseImage';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userRole, userStatus } from 'utils/constants';

const UserUpdate = () => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        getValues,
        formState: { isSubmitting, isValid },
    } = useForm({
        mode: 'onChange',
    });

    const [params] = useSearchParams();
    const userId = params.get('id');
    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, "users", userId);
            await updateDoc(colRef, {
                ...values,
            })
            toast.success("Update user successfully!!")
        } catch (error) {
            console.log('error: ', error);
            toast.error("Update user failed")
        }

    };
    const watchRole = watch('role');
    const watchStatus = watch('status');
    const imageURL = getValues("avatar")
    useEffect(() => {
        async function fetchData() {
            if (!userId) return;
            const colRef = doc(db, "users", userId);
            const docData = await getDoc(colRef)
            reset(docData && docData.data())
        }
        fetchData()
    }, [userId, reset])
    const {
        image,
        handleResetUpload,
        progress,
        handleSelectImage,
        handleDeleteImage,
    } = useFirebaseImage(setValue, getValues);
    if (!userId) return null;

    return (
        <div>
            <DashboardHeading
                title='Update user'
                desc='Update user information'></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className='w-[200px] h-[200px] mx-auto mb-10'>
                    <ImageUpload
                        className='!rounded-full h-full'
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        progress={progress}
                        image={imageURL}
                    ></ImageUpload>
                </div>
                <div className='form-layout'>
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name='fullname'
                            placeholder='Enter your fullname'
                            control={control}></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name='username'
                            placeholder='Enter your username'
                            control={control}></Input>
                    </Field>
                </div>
                <div className='form-layout'>
                    <Field>
                        <Label>Email</Label>
                        <Input
                            name='email'
                            placeholder='Enter your email'
                            control={control}
                            type='email'></Input>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <Input
                            name='password'
                            placeholder='Enter your password'
                            control={control}
                            type='password'></Input>
                    </Field>
                </div>
                <div className='form-layout'>
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name='status'
                                control={control}
                                checked={Number(watchStatus) === userStatus.ACTIVE}
                                value={userStatus.ACTIVE}>
                                Active
                            </Radio>
                            <Radio
                                name='status'
                                control={control}
                                checked={Number(watchStatus) === userStatus.PENDING}
                                value={userStatus.PENDING}>
                                Pending
                            </Radio>
                            <Radio
                                name='status'
                                control={control}
                                checked={Number(watchStatus) === userStatus.BAN}
                                value={userStatus.BAN}>
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio
                                name='role'
                                control={control}
                                checked={Number(watchRole) === userRole.ADMIN}
                                value={userRole.ADMIN}>
                                Admin
                            </Radio>
                            <Radio
                                name='role'
                                control={control}
                                checked={Number(watchRole) === userRole.MOD}
                                value={userRole.MOD}>
                                Moderator
                            </Radio>
                            <Radio
                                name='role'
                                control={control}
                                checked={Number(watchRole) === userRole.USER}
                                value={userRole.USER}>
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    kind='primary'
                    className='mx-auto w-[200px]'
                    type='submit'
                    disabled={isSubmitting}
                    isLoading={isSubmitting}>
                    Update user
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;
