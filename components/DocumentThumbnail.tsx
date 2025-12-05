import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FileText, File } from 'lucide-react-native';

interface DocumentThumbnailProps {
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  isOwn?: boolean;
  forwarded?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function DocumentThumbnail({
  fileName,
  fileSize,
  mimeType,
  isOwn = false,
  forwarded = false,
  onPress,
  onLongPress,
}: DocumentThumbnailProps) {
  const getFileIcon = () => {
    if (mimeType?.includes('pdf')) {
      return <FileText size={32} color={isOwn ? '#0b141a' : '#007aff'} strokeWidth={2} />;
    }
    return <File size={32} color={isOwn ? '#0b141a' : '#007aff'} strokeWidth={2} />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}>
      {forwarded && (
        <View style={styles.forwardedBanner}>
          <Text style={[styles.forwardedText, isOwn && styles.forwardedTextOwn]}>
            Forwarded
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getFileIcon()}
        </View>
        <View style={styles.info}>
          <Text
            style={[styles.fileName, isOwn && styles.fileNameOwn]}
            numberOfLines={2}>
            {fileName}
          </Text>
          {fileSize && (
            <Text style={[styles.fileSize, isOwn && styles.fileSizeOwn]}>
              {formatFileSize(fileSize)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 250,
  },
  containerOwn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  containerOther: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  forwardedBanner: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  forwardedText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  forwardedTextOwn: {
    color: 'rgba(11, 20, 26, 0.6)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  fileNameOwn: {
    color: '#0b141a',
  },
  fileSize: {
    fontSize: 12,
    color: '#94a3b8',
  },
  fileSizeOwn: {
    color: 'rgba(11, 20, 26, 0.7)',
  },
});
