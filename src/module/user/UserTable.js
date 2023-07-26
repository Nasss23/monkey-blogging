import { ActionDelete, ActionEdit } from 'components/action';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const colRef = collection(db, 'users');
        onSnapshot(colRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUserList(results);
        });
    }, []);

    const renderUserItem = (user) => {
        console.log('user: ', user);
        return (
            <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td className='whitespace-nowrap'>
                    <div className='flex items-center gap-x-3'>
                        <img src="https://plus.unsplash.com/premium_photo-1690297971162-5fe7ddf2c48d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60" alt="" className='flex-shrink-0 object-cover w-10 h-10 rounded-md' />
                        <div className="flex-1">
                            <h3>{user?.fullname}</h3>
                            <time className='text-sm text-gray-400'>{new Date().toLocaleDateString()}</time>
                        </div>
                    </div>
                </td>
                <td>{user?.username}</td>
                <td>{user.email.slice(0, 5) + "...@gmail.com"}</td>
                <td></td>
                <td></td>
                <td>
                    <div className='flex items-center gap-x-3'>
                        <ActionEdit
                            onClick={() =>
                                navigate(`/manage/update-user?id=${user.id}`)
                            }></ActionEdit>
                        <ActionDelete></ActionDelete>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>
                        <th>Username</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 && userList.map((user) => renderUserItem(user))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;
