import Heading from 'components/layout/Heading';
import React from 'react';
import PostItem from './PostItem';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from 'firebase-app/firebase-config';

const PostRelated = ({ categoryId = "" }) => {
    const [post, setPost] = useState([])
    useEffect(() => {
        const docRef = query(collection(db, "posts"), where("categoryId", "==", categoryId));
        onSnapshot(docRef, snapshot => {
            const results = []
            snapshot.forEach(doc => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            console.log('results: ', results);

            setPost(results)
        })
    }, [categoryId])
    if (!categoryId || post.length <= 0) return null;
    console.log('categoryId: ', categoryId);
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
                {post.map((item) => (
                    <PostItem key={item.id} data={item}></PostItem>
                ))}
            </div>
        </div>
    );
};

export default PostRelated;