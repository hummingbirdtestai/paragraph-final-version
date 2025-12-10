//notifications.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';

export default function NotificationInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchUserAndNotifications();
  }, []);

  const fetchUserAndNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);
    await fetchNotifications(user.id);
    await markAllAsRead(user.id);
  };

  const fetchNotifications = async (uid) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('student_notifications')
      .select('*')
      .eq('student_id', uid)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }

    setLoading(false);
  };

  const markAllAsRead = async (uid) => {
    await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('student_id', uid)
      .eq('is_read', false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return `Today — ${dateStr}`;
    if (isYesterday) return `Yesterday — ${dateStr}`;
    return dateStr;
  };

  const groupNotificationsByDate = (notifs) => {
    const grouped = {};

    notifs.forEach((notif) => {
      const dateKey = formatDate(notif.created_at);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(notif);
    });

    return Object.keys(grouped).map((title) => ({
      title,
      data: grouped[title],
    }));
  };

  const handleSelectMode = () => {
    setSelectMode(true);
    setSelectedIds(new Set());
  };

  const handleCancel = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleClearSelected = async () => {
    if (selectedIds.size === 0) return;

    const idsArray = Array.from(selectedIds);

    const { error } = await supabase
      .from('student_notifications')
      .update({ is_hidden: true })
      .in('id', idsArray);

    if (!error) {
      await fetchNotifications(userId);
      setSelectMode(false);
      setSelectedIds(new Set());
    }
  };

  const handleClearAll = async () => {
    const { error } = await supabase
      .from('student_notifications')
      .update({ is_hidden: true })
      .eq('student_id', userId);

    if (!error) {
      await fetchNotifications(userId);
      setSelectMode(false);
      setSelectedIds(new Set());
    }
  };

  const renderNotification = ({ item }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isSelected && styles.notificationItemSelected,
        ]}
        onPress={() => selectMode && toggleSelection(item.id)}
        disabled={!selectMode}
      >
        {selectMode && (
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
              {isSelected && <Check size={16} color="#FFFFFF" />}
            </View>
          </View>
        )}

        <View style={styles.notificationContent}>
          <Text style={styles.message}>{item.message}</Text>

          <Text style={styles.timestamp}>
            {formatTimestamp(item.created_at)}
          </Text>

          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const sections = groupNotificationsByDate(notifications);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {!selectMode ? (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleSelectMode} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionBar}>
          <TouchableOpacity
            onPress={handleClearSelected}
            style={[
              styles.actionButton,
              selectedIds.size === 0 && styles.actionButtonDisabled,
            ]}
            disabled={selectedIds.size === 0}
          >
            <Text
              style={[
                styles.actionButtonText,
                selectedIds.size === 0 && styles.actionButtonTextDisabled,
              ]}
            >
              Clear Selected
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClearAll} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#25D366',
  },
  actionButtonTextDisabled: {
    color: '#9CA3AF',
  },
  listContent: {
    padding: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationItemSelected: {
    backgroundColor: '#2A3F4F',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#25D366',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
