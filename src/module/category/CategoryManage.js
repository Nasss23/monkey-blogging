import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { Button } from 'components/button';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React, { useEffect, useState } from 'react';
import { categoryStatus } from 'utils/constants';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const CATEGORY_PER_PAGE = 1;

const CategoryManage = () => {
  const [categoryList, setCategoyList] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0)

  const handleLoadMoreCategory = async () => {
    const nextRef = query(
      collection(db, 'category'),
      startAfter(lastDoc || 0),
      limit(CATEGORY_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoyList([...categoryList, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);
    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastDoc(lastVisible);
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, 'category');
      const newRef = filter
        ? query(
          colRef,
          where('name', '>=', filter),
          where('name', '<=', filter + 'utf8')
        )
        : query(colRef, limit(CATEGORY_PER_PAGE));

      const documentSnapshots = await getDocs(newRef);
      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      onSnapshot(colRef, snapshot => {
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
        setCategoyList(result);
      });
    }
    fetchData();
  }, [filter]);

  const handleDeleteCategory = async (docId) => {
    const colRef = doc(db, 'category', docId);
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
        await deleteDoc(colRef);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  return (
    <div>
      <DashboardHeading title='Categories' desc='Manage your category'>
        <Button kind='primary' height='60px' to='/manage/add-category'>
          Create category
        </Button>
      </DashboardHeading>
      <div className='flex justify-end mb-10'>
        <input
          type='text'
          placeholder='Search category....'
          className='px-5 py-4 border border-gray-400 rounded-lg'
          onChange={handleInputFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <span className='italic text-gray-400'>{category.slug}</span>
                </td>
                <td>
                  {Number(category.status) === categoryStatus.APPROVED && (
                    <LabelStatus type='success'>Approved</LabelStatus>
                  )}
                  {Number(category.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type='warning'>Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className='flex items-center gap-x-3'>
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${category.id}`)
                      }></ActionEdit>
                    <ActionDelete
                      onClick={() =>
                        handleDeleteCategory(category.id)
                      }></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > categoryList.length &&
        <div className='mt-10'>
          <Button onClick={handleLoadMoreCategory} className={'mx-auto'}>Load more</Button>
        </div>
      }
    </div>
  );
};

export default CategoryManage;
