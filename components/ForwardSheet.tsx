import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView, Image, Platform } from 'react-native';
import { useState } from 'react';
import { X, Search, Check } from 'lucide-react-native';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
}

interface ForwardSheetProps {
  visible: boolean;
  onClose: () => void;
  onForward: (contactIds: string[]) => void;
}

export default function ForwardSheet({
  visible,
  onClose,
  onForward,
}: ForwardSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const mockContacts: Contact[] = [
    { id: '1', name: 'Priya Sharma', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', lastMessage: 'Hey! How are you?' },
    { id: '2', name: 'Rahul Verma', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', lastMessage: 'See you tomorrow' },
    { id: '3', name: 'Study Group', lastMessage: 'New assignment posted' },
    { id: '4', name: 'Ananya Patel', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', lastMessage: 'Thanks for the notes!' },
    { id: '5', name: 'Medical College 2024', lastMessage: 'Exam schedule updated' },
  ];

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleForward = () => {
    if (selectedContacts.length > 0) {
      onForward(selectedContacts);
      setSelectedContacts([]);
      setSearchQuery('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedContacts([]);
    setSearchQuery('');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#e5e7eb" strokeWidth={2} />
            </Pressable>
            <Text style={styles.title}>Forward to...</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#94a3b8" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts or groups"
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {selectedContacts.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedText}>
                {selectedContacts.length} selected
              </Text>
            </View>
          )}

          <ScrollView style={styles.contactsList}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            {filteredContacts.map(contact => (
              <Pressable
                key={contact.id}
                style={styles.contactItem}
                onPress={() => toggleContact(contact.id)}>
                {contact.avatar ? (
                  <Image
                    source={{ uri: contact.avatar }}
                    style={styles.contactAvatar}
                  />
                ) : (
                  <View style={[styles.contactAvatar, styles.contactAvatarPlaceholder]}>
                    <Text style={styles.contactAvatarText}>
                      {contact.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.lastMessage && (
                    <Text style={styles.contactLastMessage} numberOfLines={1}>
                      {contact.lastMessage}
                    </Text>
                  )}
                </View>
                <View style={[
                  styles.checkbox,
                  selectedContacts.includes(contact.id) && styles.checkboxSelected
                ]}>
                  {selectedContacts.includes(contact.id) && (
                    <Check size={16} color="#0b141a" strokeWidth={3} />
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={[
              styles.forwardButton,
              selectedContacts.length === 0 && styles.forwardButtonDisabled
            ]}
            onPress={handleForward}
            disabled={selectedContacts.length === 0}>
            <Text style={styles.forwardButtonText}>
              Forward to {selectedContacts.length} {selectedContacts.length === 1 ? 'contact' : 'contacts'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111b21',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a2329',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#e5e7eb',
  },
  selectedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a2329',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#25D366',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contactAvatarPlaceholder: {
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b141a',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  contactLastMessage: {
    fontSize: 14,
    color: '#94a3b8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  forwardButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: '#25D366',
    borderRadius: 12,
    alignItems: 'center',
  },
  forwardButtonDisabled: {
    backgroundColor: '#1a2329',
  },
  forwardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b141a',
  },
});
