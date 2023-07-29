import Heading from 'components/layout/Heading';
import { db } from 'firebase-app/firebase-config';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import PostFeatureItem from 'module/post/PostFeatureItem';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  const [post, setPost] = useState([]);
  useEffect(() => {
    const colRef = collection(db, 'posts');
    const queries = query(
      colRef,
      where('status', '==', 1),
      where('hot', '==', true),
      limit(3)
    );
    onSnapshot(queries, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPost(result);
    });
  }, []);
  if (post.length <= 0) return null;
  console.log('post: ', post);
  return (
    <HomeFeatureStyles className='home-block'>
      <div className='container'>
        <Heading>Bài viết nổi bật</Heading>
        <div className='grid-layout'>
          {post.map((posts) => (
            <PostFeatureItem key={posts.id} data={posts}></PostFeatureItem>
          ))}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
