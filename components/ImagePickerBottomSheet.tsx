import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import { Camera, Image as ImageIcon, File, X } from 'lucide-react-native';
import { useState } from 'react';

interface ImagePickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

export default function ImagePickerBottomSheet({
  visible,
  onClose,
  onImageSelected,
}: ImagePickerBottomSheetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCamera = () => {
    const mockImageUri = 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
    setSelectedImage(mockImageUri);
  };

  const handleGallery = () => {
    const mockImageUri = 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
    setSelectedImage(mockImageUri);
  };

  const handleFiles = () => {
    const mockImageUri = 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
    setSelectedImage(mockImageUri);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Image</Text>
            <Pressable style={styles.closeButton} onPress={handleCancel}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          {selectedImage ? (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Image Preview</Text>
              <Image source={{ uri: selectedImage }} style={styles.preview} />
              <View style={styles.previewActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setSelectedImage(null)}>
                  <Text style={styles.cancelButtonText}>Change</Text>
                </Pressable>
                <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>Use This Image</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.options}>
              <Pressable style={styles.option} onPress={handleCamera}>
                <View style={styles.iconContainer}>
                  <Camera size={24} color="#e5e7eb" strokeWidth={2} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Camera</Text>
                  <Text style={styles.optionDescription}>Take a new photo</Text>
                </View>
              </Pressable>

              <Pressable style={styles.option} onPress={handleGallery}>
                <View style={styles.iconContainer}>
                  <ImageIcon size={24} color="#e5e7eb" strokeWidth={2} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Gallery</Text>
                  <Text style={styles.optionDescription}>Choose from your photos</Text>
                </View>
              </Pressable>

              <Pressable style={styles.option} onPress={handleFiles}>
                <View style={styles.iconContainer}>
                  <File size={24} color="#e5e7eb" strokeWidth={2} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Files</Text>
                  <Text style={styles.optionDescription}>Select from files</Text>
                </View>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#111b21',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  previewContainer: {
    padding: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1a2329',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
});
