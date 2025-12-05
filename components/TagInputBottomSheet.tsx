import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { X, Hash, Plus } from 'lucide-react-native';
import { useState } from 'react';

interface TagInputBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddTags: (tags: string[]) => void;
  existingTags: string[];
}

const SUGGESTED_TAGS = [
  '#anatomy',
  '#pharmacology',
  '#cardiology',
  '#pathology',
  '#surgery',
  '#medschool',
  '#medstudent',
  '#usmle',
  '#neet',
  '#medicalstudent',
  '#studytips',
  '#examprep',
  '#medlife',
  '#futuredoctor',
];

export default function TagInputBottomSheet({
  visible,
  onClose,
  onAddTags,
  existingTags,
}: TagInputBottomSheetProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(existingTags);
  const [customTag, setCustomTag] = useState('');

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && selectedTags.length < 5) {
      const formattedTag = customTag.trim().startsWith('#')
        ? customTag.trim()
        : `#${customTag.trim()}`;

      if (!selectedTags.includes(formattedTag)) {
        setSelectedTags([...selectedTags, formattedTag]);
        setCustomTag('');
      }
    }
  };

  const handleDone = () => {
    onAddTags(selectedTags);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTags(existingTags);
    setCustomTag('');
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
            <View style={styles.headerLeft}>
              <Hash size={22} color="#25D366" strokeWidth={2} />
              <Text style={styles.title}>Add Tags</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={handleCancel}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            <Text style={styles.subtitle}>
              Add up to 5 tags to help others discover your post
            </Text>

            {selectedTags.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                <Text style={styles.sectionLabel}>Selected ({selectedTags.length}/5)</Text>
                <View style={styles.selectedTags}>
                  {selectedTags.map((tag, index) => (
                    <Pressable
                      key={index}
                      style={styles.selectedTag}
                      onPress={() => handleToggleTag(tag)}>
                      <Text style={styles.selectedTagText}>{tag}</Text>
                      <X size={14} color="#25D366" strokeWidth={2.5} />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.customTagContainer}>
              <Text style={styles.sectionLabel}>Add Custom Tag</Text>
              <View style={styles.customTagInput}>
                <TextInput
                  style={styles.input}
                  value={customTag}
                  onChangeText={setCustomTag}
                  placeholder="Type a tag (e.g., cardiology)"
                  placeholderTextColor="#64748b"
                  onSubmitEditing={handleAddCustomTag}
                  returnKeyType="done"
                />
                <Pressable
                  style={[
                    styles.addButton,
                    (!customTag.trim() || selectedTags.length >= 5) && styles.addButtonDisabled,
                  ]}
                  onPress={handleAddCustomTag}
                  disabled={!customTag.trim() || selectedTags.length >= 5}>
                  <Plus size={20} color="#0b141a" strokeWidth={2.5} />
                </Pressable>
              </View>
            </View>

            <View style={styles.suggestedTagsContainer}>
              <Text style={styles.sectionLabel}>Suggested Tags</Text>
              <View style={styles.suggestedTags}>
                {SUGGESTED_TAGS.map((tag, index) => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled = !isSelected && selectedTags.length >= 5;
                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.suggestedTag,
                        isSelected && styles.suggestedTagSelected,
                        isDisabled && styles.suggestedTagDisabled,
                      ]}
                      onPress={() => handleToggleTag(tag)}
                      disabled={isDisabled}>
                      <Text
                        style={[
                          styles.suggestedTagText,
                          isSelected && styles.suggestedTagTextSelected,
                        ]}>
                        {tag}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
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
    maxHeight: '85%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  body: {
    maxHeight: 500,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    lineHeight: 20,
  },
  selectedTagsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a3929',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  selectedTagText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '500',
  },
  customTagContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  customTagInput: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a2329',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#2a3942',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#1a3929',
    opacity: 0.5,
  },
  suggestedTagsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedTag: {
    backgroundColor: '#1a2329',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2a3942',
  },
  suggestedTagSelected: {
    backgroundColor: '#1a3929',
    borderColor: '#25D366',
  },
  suggestedTagDisabled: {
    opacity: 0.3,
  },
  suggestedTagText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  suggestedTagTextSelected: {
    color: '#25D366',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
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
  doneButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
});
