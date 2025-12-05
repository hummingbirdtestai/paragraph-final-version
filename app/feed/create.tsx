import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, Sparkles, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import ImagePickerBottomSheet from '@/components/ImagePickerBottomSheet';
import DraftRecoveryBanner from '@/components/DraftRecoveryBanner';
import VisibilityTipsPopup from '@/components/VisibilityTipsPopup';
import Snackbar from '@/components/Snackbar';
import Tooltip from '@/components/Tooltip';
import { supabase } from "@/lib/supabaseClient";

const DRAFT_KEY = 'post_draft';
const DRAFT_IMAGE_KEY = 'post_draft_image';

export default function CreatePostScreen() {
  const router = useRouter();
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [visibilityTipsVisible, setVisibilityTipsVisible] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    checkForDraft();
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (postContent || selectedImages.length > 0) {
      const timer = setTimeout(saveDraft, 2000);
      return () => clearTimeout(timer);
    }
  }, [postContent, selectedImages]);

  const checkForDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      const draftImage = localStorage.getItem(DRAFT_IMAGE_KEY);
      if (draft || draftImage) {
        setHasDraft(true);
        setShowDraftBanner(true);
      }
    } catch (e) {
      console.log('Error checking draft:', e);
    }
  };

  const saveDraft = () => {
    if (postContent.trim() || selectedImages.length > 0) {
      try {
        localStorage.setItem(DRAFT_KEY, postContent);
        if (selectedImages.length > 0) {
          localStorage.setItem(DRAFT_IMAGE_KEY, JSON.stringify(selectedImages));
        }
      } catch (e) {
        console.log('Error saving draft:', e);
      }
    }
  };

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      const draftImages = localStorage.getItem(DRAFT_IMAGE_KEY);
      if (draft) setPostContent(draft);
      if (draftImages) setSelectedImages(JSON.parse(draftImages));
      setShowDraftBanner(false);
    } catch (e) {
      console.log('Error loading draft:', e);
    }
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_IMAGE_KEY);
      setShowDraftBanner(false);
      setHasDraft(false);
    } catch (e) {
      console.log('Error discarding draft:', e);
    }
  };

  const handleImageSelected = (imageUri: string) => {
    setSelectedImages(prev => [...prev, imageUri]);
  };

  const handleRemoveImage = (uriToRemove: string) => {
    setSelectedImages(prev => prev.filter(uri => uri !== uriToRemove));
  };

const handlePost = async () => {
  if (!postContent.trim() && selectedImages.length === 0) {
    setSnackbar({
      visible: true,
      message: "Please add text or at least one image",
      type: "error",
    });
    return;
  }

  setIsPosting(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("title", postContent.substring(0, 40) || "");
    formData.append("content_text", postContent);

    selectedImages.forEach((uri, index) => {
      const filename = uri.split("/").pop() || `image_${Date.now()}_${index}.jpg`;
      const ext = filename.split(".").pop();

      formData.append("media_files", {
        uri,
        name: filename,
        type: `image/${ext}`,
      } as any);
    });

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed/create-post`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to create post");

    discardDraft();

    setSnackbar({
      visible: true,
      message: "Post successfully created!",
      type: "success",
    });

    setTimeout(() => setVisibilityTipsVisible(true), 500);
  } catch (error) {
    console.log(error);
    setSnackbar({
      visible: true,
      message: "Failed to create post. Please try again.",
      type: "error",
    });
  } finally {
    setIsPosting(false);
  }
};


  const handleVisibilityTipsClosed = () => {
    setVisibilityTipsVisible(false);
    router.back();
  };

  useEffect(() => {
    try {
      const seen = localStorage.getItem('has_seen_image_tooltip');
      if (!seen) {
        const timer = setTimeout(() => {
          setShowTooltip(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.log('Error checking tooltip:', e);
    }
  }, []);

  const handleTooltipDismiss = () => {
    setShowTooltip(false);
    try {
      localStorage.setItem('has_seen_image_tooltip', 'true');
    } catch (e) {
      console.log('Error saving tooltip state:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Pressable
          style={[styles.postButton, (!postContent.trim() && selectedImages.length === 0) && styles.postButtonDisabled, isPosting && styles.postButtonLoading]}
          onPress={handlePost}
          disabled={(!postContent.trim() && selectedImages.length === 0) || isPosting}>
          {isPosting ? (
            <ActivityIndicator size="small" color="#0b141a" />
          ) : (
            <View style={styles.postButtonContent}>
              <Sparkles size={16} color="#0b141a" strokeWidth={2} />
              <Text style={styles.postButtonText}>Post with AI</Text>
            </View>
          )}
        </Pressable>
      </View>

      <DraftRecoveryBanner
        visible={showDraftBanner}
        onResume={loadDraft}
        onDiscard={discardDraft}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#64748b"
          multiline
          autoFocus
          value={postContent}
          onChangeText={setPostContent}
        />

        {selectedImages.length > 0 && (
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            {selectedImages.map(uri => (
              <View key={uri} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(uri)}
                >
                  <X size={20} color="#e5e7eb" strokeWidth={2.5} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.toolbar}>
          <Pressable
            style={styles.toolButton}
            onPress={() => setImagePickerVisible(true)}>
            <ImageIcon size={22} color="#94a3b8" strokeWidth={1.8} />
            <Text style={styles.toolText}>Add Image</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ImagePickerBottomSheet
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onImageSelected={handleImageSelected}
      />

      <VisibilityTipsPopup
        visible={visibilityTipsVisible}
        onClose={handleVisibilityTipsClosed}
        postContent={postContent}
      />

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      <Tooltip
        visible={showTooltip}
        message="Tap here to add images to your post and make it more engaging!"
        onDismiss={handleTooltipDismiss}
        position="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    flex: 1,
    textAlign: 'center',
  },
  postButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#1a3929',
    opacity: 0.5,
  },
  postButtonLoading: {
    opacity: 0.8,
  },
  postButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
  content: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e5e7eb',
    padding: 16,
    minHeight: 300,
  },
  toolbar: {
    padding: 16,
    gap: 12,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#111b21',
    borderRadius: 12,
  },
  toolText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
