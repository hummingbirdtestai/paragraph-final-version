import { Platform, Alert } from 'react-native';

export const shareAttachment = async (uri: string, fileName: string) => {
  try {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: fileName,
          url: uri,
        });
      } else {
        await navigator.clipboard.writeText(uri);
        Alert.alert('Link copied', 'The file link has been copied to your clipboard');
      }
    } else {
      const { default: Share } = await import('react-native').then(m => ({ default: m.Share }));
      await Share.share({
        url: uri,
        title: fileName,
      });
    }
  } catch (error) {
    console.error('Error sharing attachment:', error);
    throw error;
  }
};

export const downloadAttachment = async (uri: string, fileName: string) => {
  try {
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = uri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Alert.alert('Download', 'File download on mobile will be available soon');
    }
  } catch (error) {
    console.error('Error downloading attachment:', error);
    throw error;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const isImageFile = (mimeType?: string, fileName?: string): boolean => {
  if (mimeType) {
    return mimeType.startsWith('image/');
  }
  if (fileName) {
    const ext = getFileExtension(fileName);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(ext);
  }
  return false;
};

export const isVideoFile = (mimeType?: string, fileName?: string): boolean => {
  if (mimeType) {
    return mimeType.startsWith('video/');
  }
  if (fileName) {
    const ext = getFileExtension(fileName);
    return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
  }
  return false;
};

export const isDocumentFile = (mimeType?: string, fileName?: string): boolean => {
  if (mimeType) {
    return (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation') ||
      mimeType.includes('text')
    );
  }
  if (fileName) {
    const ext = getFileExtension(fileName);
    return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext);
  }
  return false;
};
