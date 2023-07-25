import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { Button } from 'components/button';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import { collection, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React, { useEffect, useState } from 'react';
import { categoryStatus } from 'utils/constants';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CategoryManage = () => {
  const [categoryList, setCategoyList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, 'category');
    onSnapshot(colRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoyList(result);
    });
  }, []);
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
  return (
    <div>
      <DashboardHeading title='Categories' desc='Manage your category'>
        <Button kind='primary' height='60px' to='/manage/add-category'>
          Create category
        </Button>
      </DashboardHeading>
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
                  {category.status === categoryStatus.APPROVED && (
                    <LabelStatus type='success'>Approved</LabelStatus>
                  )}
                  {category.status === categoryStatus.UNAPPROVED && (
                    <LabelStatus type='warning'>Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className='flex items-center gap-x-3'>
                    <ActionView></ActionView>
                    <ActionEdit onClick={() => navigate(`/manage/update-category?id=${category.id}`)}></ActionEdit>
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
    </div>
  );
};

export default CategoryManage;
