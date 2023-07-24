import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Dropdown } from 'components/dropdown';
import { Field } from 'components/field';
import { Input } from 'components/input';
import { Label } from 'components/label';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import styled from 'styled-components';
import { postStatus } from 'utils/constants';

import ImageUpload from 'components/image/ImageUpload';
import useFirebaseImage from 'hooks/useFirebaseImage';
import Toggle from 'components/toggle/Toggle';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from 'firebase-app/firebase-config';
import { useAuth } from 'contexts/auth-context';
import { toast } from 'react-toastify';

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();
  console.log('userInfo: ', userInfo);
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      status: 2,
      categoryId: '',
      hot: false,
      image: "",
    },
  });
  const watchStatus = watch('status');
  const watchHot = watch('hot');
  // const watchCategory = watch('category');
  const { image, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues);

  const addPostHandler = async (values) => {
    const cloneValue = { ...values };
    cloneValue.slug = slugify(values.slug || values.title, { lower: true });
    cloneValue.status = Number(values.status);
    const colRef = collection(db, 'posts');
    await addDoc(colRef, {
      ...cloneValue,
      image,
      userId: userInfo.uid,
      createAt: serverTimestamp
    });
    toast.success('Create new post successfully');
    reset({
      title: '',
      slug: '',
      status: 2,
      categoryId: '',
      hot: false,
      image: ""
    });
    setSelectCategory({})
  };
  const [category, setCatrgory] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, 'category');
      const q = query(colRef, where('status', '==', 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCatrgory(result);
    }
    getData();
  }, []);

  const handleClickOption = (item) => {
    setValue('categoryId', item.id);
    setSelectCategory(item);
  };

  return (
    <PostAddNewStyles>
      <h1 className='dashboard-heading'>Add new post</h1>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className='grid grid-cols-2 mb-10 gap-x-10'>
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder='Enter your title'
              name='title'
              required></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder='Enter your slug'
              name='slug'></Input>
          </Field>
        </div>
        <div className='grid grid-cols-2 mb-10 gap-x-10'>
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              className='h-[250px]'
              handleDeleteImage={handleDeleteImage}
              progress={progress}
              image={image}></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              {/* <Dropdown.Select placeholder={`${selectCategory.name || 'Select the category'}`}></Dropdown.Select> */}
              <Dropdown.Select placeholder='Select the category'></Dropdown.Select>
              <Dropdown.List>
                {category.length > 0 &&
                  category.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}>
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className='inline-block p-3 text-sm font-medium text-green-600 rounded-lg bg-green-50'>
                {selectCategory.name}
              </span>
            )}
          </Field>
          {/* <Field>
            <Label>Author</Label>
            <Input control={control} placeholder='Find the author'></Input>
          </Field> */}
        </div>
        <div className='grid grid-cols-2 mb-10 gap-x-10'>
          <Field>
            <Label>Feature post</Label>

            <Toggle
              on={watchHot === true}
              onClick={() => setValue('hot', !watchHot)}></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <div className='flex items-center gap-x-5'>
              <Radio
                name='status'
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                onClick={() => setValue('status', 'approved')}
                value={postStatus.APPROVED}>
                Approved
              </Radio>
              <Radio
                name='status'
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                onClick={() => setValue('status', 'pending')}
                value={postStatus.PENDING}>
                Pending
              </Radio>
              <Radio
                name='status'
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                onClick={() => setValue('status', 'reject')}
                value={postStatus.REJECTED}>
                Reject
              </Radio>
            </div>
          </Field>
        </div>
        <Button type='submit' className='mx-auto'>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
