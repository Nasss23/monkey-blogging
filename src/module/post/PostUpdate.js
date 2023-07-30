import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Dropdown } from 'components/dropdown';
import { Field } from 'components/field';
import ImageUpload from 'components/image/ImageUpload';
import { Input } from 'components/input';
import { Label } from 'components/label';
import Toggle from 'components/toggle/Toggle';
import { db } from 'firebase-app/firebase-config';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import useFirebaseImage from 'hooks/useFirebaseImage';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { postStatus } from 'utils/constants';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import ImageUploader from "quill-image-uploader";
import { useMemo } from 'react';
import { imgbbAPI } from 'config/apiConfig';
import axios from 'axios';
import slugify from 'slugify';
Quill.register('modules/imageUploader', ImageUploader);

const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [categories, setCatrgories] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [content, setContent] = useState("")
  const { control, handleSubmit, setValue, getValues, watch, reset, formState: {
    isValid, isSubmitting
  } } = useForm({
    mode: "onChange"
  });
  const watchHot = watch("hot");
  const watchStatus = watch('status');
  const imageURL = getValues('image');
  const imageName = getValues("image_name")
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteImage);

  async function deleteImage() {
    const colRef = doc(db, 'users', postId);
    await updateDoc(colRef, {
      image: '',
    });
  }
  useEffect(() => {
    setImage(imageURL);
  }, [imageURL, setImage]);

  useEffect(() => {
    async function getCategoriesData() {
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
    getCategoriesData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      const docRef = doc(db, "posts", postId)
      const docSnapshot = await getDoc(docRef)
      if (docSnapshot.data()) {
        reset(docSnapshot.data())
        setSelectCategory(docSnapshot.data()?.category || "")
        setContent(docSnapshot.data()?.content || "")
      }
    }
    fetchData()
  }, [postId, reset])

  const handleClickOption = async (item) => {
    const colRef = doc(db, 'category', item.id)
    const docData = await getDoc(colRef)
    setValue("category", {
      id: docData.id,
      ...docData.data()
    });
    setSelectCategory(item);
  };
  const updatePostHandler = async (values) => {
    if (!isValid) return;
    const docRef = doc(db, "posts", postId);
    values.status = Number(values.status);
    values.slug = slugify(values.slug || values.title, { lower: true });
    await updateDoc(docRef, {
      ...values,
      image,
      content
    })
    toast.success("Update successfully")
  }
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image']
    ],
    imageUploader: {
      upload: async (file) => {
        const bodyFormData = new FormData()
        bodyFormData.append("image", file)
        const reponse = await axios({
          method: "post",
          url: imgbbAPI,
          data: bodyFormData,
          header: {
            "Content-Type": "multipart/form-data"
          },
        })
        return reponse.data.data.url
      },
    }
  }), [])

  if (!postId) return
  return (
    <div>
      <DashboardHeading
        title='Update posts'
        desc='Update posts content'>
      </DashboardHeading>
      <form onSubmit={handleSubmit(updatePostHandler)}>
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
                      onClick={() => handleClickOption(item)}
                    >
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
        </div>
        <div className='mb-10'>
          <Field>
            <Label>Content</Label>
            <div className='w-full entry-content'>
              <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
            </div>
          </Field>
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
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update post
        </Button>
      </form>
    </div>
  );
};

export default PostUpdate;
