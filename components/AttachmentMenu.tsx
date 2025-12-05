import { View, Text, StyleSheet, Modal, Pressable, Animated, Dimensions, Platform } from 'react-native';
import { useEffect, useRef } from 'react';
import { Image, Video, FileText, Mic, MapPin, UserCircle2 } from 'lucide-react-native';

interface AttachmentMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
  onSelectDocument: () => void;
  onSelectAudio: () => void;
  onSelectLocation: () => void;
  onSelectContact: () => void;
}

export default function AttachmentMenu({
  visible,
  onClose,
  onSelectGallery,
  onSelectCamera,
  onSelectDocument,
  onSelectAudio,
  onSelectLocation,
  onSelectContact,
}: AttachmentMenuProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const screenHeight = Dimensions.get('window').height;
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const handleClose = () => {
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}>
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}>
          <View style={styles.handle} />

          <Text style={styles.title}>Send Attachment</Text>

          <View style={styles.grid}>
            <View style={styles.row}>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectGallery)}>
                <View style={[styles.iconCircle, styles.galleryCircle]}>
                  <Image size={24} color="#9b59d0" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Gallery</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectCamera)}>
                <View style={[styles.iconCircle, styles.cameraCircle]}>
                  <Video size={24} color="#ff6b9d" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Camera</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectDocument)}>
                <View style={[styles.iconCircle, styles.documentCircle]}>
                  <FileText size={24} color="#007aff" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Document</Text>
              </Pressable>
            </View>

            <View style={styles.row}>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectAudio)}>
                <View style={[styles.iconCircle, styles.audioCircle]}>
                  <Mic size={24} color="#ff9500" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Audio</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectLocation)}>
                <View style={[styles.iconCircle, styles.locationCircle]}>
                  <MapPin size={24} color="#25D366" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Location</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleAction(onSelectContact)}>
                <View style={[styles.iconCircle, styles.contactCircle]}>
                  <UserCircle2 size={24} color="#5ac8fa" strokeWidth={2} />
                </View>
                <Text style={styles.optionLabel}>Contact</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  overlayPressable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111b21',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#2a3942',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    gap: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  optionButton: {
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  galleryCircle: {
    backgroundColor: '#2d1f3d',
    borderColor: '#9b59d0',
    shadowColor: '#9b59d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraCircle: {
    backgroundColor: '#3d1f2d',
    borderColor: '#ff6b9d',
    shadowColor: '#ff6b9d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  documentCircle: {
    backgroundColor: '#1f2d3d',
    borderColor: '#007aff',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  audioCircle: {
    backgroundColor: '#3d2d1f',
    borderColor: '#ff9500',
    shadowColor: '#ff9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  locationCircle: {
    backgroundColor: '#1f3d2d',
    borderColor: '#25D366',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  contactCircle: {
    backgroundColor: '#1f2d3d',
    borderColor: '#5ac8fa',
    shadowColor: '#5ac8fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  cancelButton: {
    marginTop: 32,
    paddingVertical: 14,
    backgroundColor: '#1a2329',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
});
