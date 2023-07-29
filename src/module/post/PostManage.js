import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { Button } from 'components/button';
import { Dropdown } from 'components/dropdown';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { postStatus } from 'utils/constants';

const POST_PER_PAGE = 1;

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [lastDoc, setLastDoc] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, 'posts');
      const newRef = filter
        ? query(
          colRef,
          where('name', '>=', filter),
          where('name', '<=', filter + 'utf8')
        )
        : query(colRef, limit(POST_PER_PAGE));

      const documentSnapshots = await getDocs(newRef);
      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      setLastDoc(lastVisible);
      onSnapshot(newRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(result);
      });
    }
    fetchData();
  });
  async function handleDeletePost(postId) {
    const docRef = doc(db, "posts", postId);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRef)
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type='success'>APPROVED</LabelStatus>
      case postStatus.PENDING:
        return <LabelStatus type='warning'>PENDING</LabelStatus>
      case postStatus.REJECTED:
        return <LabelStatus type='danger'>REJECTED</LabelStatus>
      default:
        break;
    }
  }
  return (
    <div>
      <DashboardHeading
        title='All posts'
        desc='Manage all posts'></DashboardHeading>
      <div className='flex justify-end gap-5 mb-10'>
        <div className='w-full max-w-[200px]'>
          <Dropdown>
            <Dropdown.Select placeholder='Category'></Dropdown.Select>
          </Dropdown>
        </div>
        <div className='w-full max-w-[300px]'>
          <input
            type='text'
            className='w-full p-4 border border-gray-300 border-solid rounded-lg'
            placeholder='Search post...'
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((post) => {
              const date = post?.createAt?.second
                ? new Date(post?.createAt?.seconds * 1000)
                : new Date();
              const formatDate = new Date(date).toLocaleDateString('vi-VI');
              return (
                <tr key={post.id}>
                  <td>{post.id?.slice(0, 5)}...</td>
                  <td>
                    <div className='flex items-center gap-x-3'>
                      <img
                        src={post.image}
                        alt=''
                        className='w-[66px] h-[55px] rounded object-cover'
                      />
                      <div className='flex-1'>
                        <h3 className='font-semibold max-w-[200px] whitespace-pre-wrap'>{post.title}</h3>
                        <time className='text-sm text-gray-500'>Date: {formatDate}</time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className='text-gray-500'>{post.category?.name}</span>
                  </td>
                  <td>
                    <span className='text-gray-500'>{post.user?.username}</span>
                  </td>
                  <td>
                    {renderPostStatus(post.status)}
                  </td>
                  <td>
                    <div className='flex items-center text-gray-500 gap-x-3'>
                      <ActionView onClick={() => navigate(`/${post.slug}`)}></ActionView>
                      <ActionEdit></ActionEdit>
                      <ActionDelete onClick={() => handleDeletePost(post.id)}></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className='mt-10 text-center'>
        {/* <Pagination></Pagination> */}
        <Button className='mx-auto w-[200px]'>
          Load more
        </Button>
      </div>
    </div>
  );
};

export default PostManage;
