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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from 'firebase-app/firebase-config';
import { useAuth } from 'contexts/auth-context';
import { toast } from 'react-toastify';
import DashboardHeading from 'drafts/DashboardHeading';

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      status: 2,
      hot: false,
      image: '',
      category: {},
      user: {}
    },
  });
  const watchStatus = watch('status');
  const watchHot = watch('hot');
  // const watchCategory = watch('category');
  const {
    image,
    handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  const [categories, setCatrgories] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({})
  const [categoryDetails, setCatrgoryDetails] = useState({})
  useEffect(() => {
    async function fetchUserDate() {
      if (!userInfo.email) return;
      const q = query(collection(db, "users"), where("email", "==", userInfo.email))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        setValue("user", {
          id: doc.id,
          ...doc.data()
        })
      })
    }
    fetchUserDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email])

  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(values.slug || values.title, { lower: true });
      cloneValue.status = Number(values.status);
      const colRef = collection(db, 'posts');
      await addDoc(colRef, {
        ...cloneValue,
        image,
        createAt: serverTimestamp(),
      });
      toast.success('Create new post successfully');
      reset({
        title: '',
        slug: '',
        status: 2,
        hot: false,
        image: '',
        category: {},
        user: {}
      });
      handleResetUpload('');
      setSelectCategory({});
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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
      setCatrgories(result);
    }
    getData();
  }, []);

  useEffect(() => {
    document.title = 'Monkey Bloggig - Add new post'
  })

  const handleClickOption = async (item) => {
    const colRef = doc(db, 'category', item.id)
    const docData = await getDoc(colRef)
    setValue("category", {
      id: docData.id,
      ...docData.data()
    });
    setSelectCategory(item);
  };

  return (
    <PostAddNewStyles>
      <DashboardHeading
        title='Add posts'
        desc='Manage all posts'></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className='form-layout'>
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
        <div className='form-layout'>
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
                {categories.length > 0 &&
                  categories.map((item) => (
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
        <div className='form-layout'>
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
        <Button
          type='submit'
          className='mx-auto w-[250px]'
          isLoading={loading}
          disabled={loading}>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
