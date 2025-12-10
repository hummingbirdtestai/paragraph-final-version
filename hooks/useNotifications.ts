import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();

    const subscription = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_notifications',
          filter: `student_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('student_notifications')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }

    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('student_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', userId)
      .eq('is_read', false);

    if (!error && count !== null) {
      setUnreadCount(count);
    }
  };

  const markAsRead = async (notificationId) => {
    await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    fetchNotifications();
    fetchUnreadCount();
  };

  const markAllAsRead = async () => {
    await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('student_id', userId)
      .eq('is_read', false);

    fetchNotifications();
    fetchUnreadCount();
  };

  const createNotification = async (message, gifUrl = null) => {
    const { error } = await supabase
      .from('student_notifications')
      .insert({
        student_id: userId,
        message: message,
        gif_url: gifUrl,
        is_read: false,
      });

    if (!error) {
      fetchNotifications();
      fetchUnreadCount();
    }

    return { error };
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    refresh: fetchNotifications,
  };
}
