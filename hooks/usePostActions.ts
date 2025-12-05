import { supabase } from "@/lib/supabaseClient";

export function usePostActions() {
  const handleCreatePost = async ({
    user_id,
    title,
    content_text,
    media_url,
    media_type,
    subject,
    chapter,
    topic,
  }) => {
    return await supabase.rpc("create_feed_post_v3", {
      p_user_id: user_id,
      p_title: title,
      p_content_text: content_text,
      p_media_url: media_url,
      p_media_type: media_type,
      p_subject: subject,
      p_chapter: chapter,
      p_topic: topic,
    });
  };

  const handleLike = async (postId, userId) => {
    await supabase.from("feed_events").insert({
      actor_user_id: userId,
      post_id: postId,
      event_type: "like",
    });
  };

  const handleComment = async (postId, userId, text) => {
    await supabase.from("feed_events").insert({
      actor_user_id: userId,
      post_id: postId,
      event_type: "comment",
      comment_text: text,
    });
  };

  const handleShare = async (postId, userId) => {
    await supabase.from("feed_events").insert({
      actor_user_id: userId,
      post_id: postId,
      event_type: "share",
    });
  };

  return {
    handleCreatePost,
    handleLike,
    handleComment,
    handleShare,
  };
}
