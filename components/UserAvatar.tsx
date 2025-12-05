import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface UserAvatarProps {
  uri: string;
  size?: number;
}

export function UserAvatar({ uri, size = 40 }: UserAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1a2329',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
