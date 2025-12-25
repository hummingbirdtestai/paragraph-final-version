import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '@/components/HomeScreen';
import MainLayout from '@/components/MainLayout';

export default function Index() {
  const images = {
  img1: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img1.webp',
  img2: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img2.webp',
  img3: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img3.webp',
  img4: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img4.webp',
  img5: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img5.webp',
  img6: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img6.webp',
  img7: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img7.webp',
  img8: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img8.webp',
  img9: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img9.webp',
  img10: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img10.webp',
  img11: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/Home%20page%20images/img11.webp',
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
