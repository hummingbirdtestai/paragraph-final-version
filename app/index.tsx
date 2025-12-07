import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '@/components/HomeScreen';
import MainLayout from '@/components/MainLayout';

export default function Index() {
  const images = {
    img1: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/7.webp?width=900&quality=70&format=webp',
    img2: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/2.webp?width=900&quality=70&format=webp',
    img3: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/3.webp?width=900&quality=70&format=webp',
    img4: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/4.webp?width=900&quality=70&format=webp',
    img5: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/5.webp?width=900&quality=70&format=webp',
    img6: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/6.webp?width=900&quality=70&format=webp',
  };

  return (
    <MainLayout>
  <HomeScreen images={images} />
</MainLayout>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
