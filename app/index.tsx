import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '@/components/HomeScreen';
import MainLayout from '@/components/MainLayout';

export default function Index() {
  const images = {
  img1: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/1.webp',
  img2: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/2.webp',
  img3: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/3.webp',
  img4: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/4.webp',
  img5: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/5.webp',
  img6: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/6.webp',
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
