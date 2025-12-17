//videoscreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Bookmark, Heart } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

/* --------------------------------------------------
   CORE COMPONENT
-------------------------------------------------- */
function VideoScreen({
  videoUrl,
  videoUrlPath,
  posterUrl,
  speedControls = true,
  phaseUniqueId,
  isBookmarked,
  isLiked,
  progress_percent,
}) {
  const { user } = useAuth();

  const inlineRef = useRef(null);
  const fullscreenRef = useRef(null);

  const [speed, setSpeed] = useState(1.0);
  const [fullScreen, setFullScreen] = useState(false);
  const [bookmark, setBookmark] = useState(isBookmarked);
  const [liked, setLiked] = useState(isLiked);

  const resumePosition =
    progress_percent && progress_percent > 2
      ? progress_percent / 100
      : 0;

  useEffect(() => {
    if (!resumePosition) return;

    const resume = async () => {
      const player = fullScreen ? fullscreenRef.current : inlineRef.current;
      if (!player) return;

      const s = await player.getStatusAsync();
      if (s?.isLoaded && s?.durationMillis) {
        await player.setPositionAsync(
          s.durationMillis * resumePosition
        );
      }
    };

    const t = setTimeout(resume, 600);
    return () => clearTimeout(t);
  }, [fullScreen]);

  async function updateProgress(s) {
    if (!user?.id) return;
    if (!s?.positionMillis || !s?.durationMillis) return;

    const percent = Math.floor(
      (s.positionMillis / s.durationMillis) * 100
    );

    await supabase.rpc("update_video_progress_v1", {
      p_student_id: user.id,
      p_phase_id: phaseUniqueId,
      p_progress_percent: percent,
    });

    if (percent >= 90) {
      await supabase.rpc("mark_video_completed_v1", {
        p_student_id: user.id,
        p_phase_id: phaseUniqueId,
      });
    }
  }

  const resignAndReload = async () => {
    try {
      const { data } = await supabase.functions.invoke(
        "smart-action",
        { body: { path: videoUrlPath } }
      );

      if (!data?.signedUrl) return;

      const player = fullScreen ? fullscreenRef.current : inlineRef.current;
      if (!player) return;

      const s = await player.getStatusAsync();
      const pos = s?.positionMillis || 0;

      await player.loadAsync(
        { uri: data.signedUrl },
        { shouldPlay: true, positionMillis: pos }
      );
    } catch {}
  };

  const handlePlayback = (s) => {
    updateProgress(s);
    if (s?.error) resignAndReload();
  };

  async function toggleLike() {
    if (!user?.id) return;
    setLiked(!liked);

    await supabase.rpc("toggle_video_like_v1", {
      p_student_id: user.id,
      p_phase_id: phaseUniqueId,
    });
  }

  async function toggleBookmark() {
    if (!user?.id) return;
    setBookmark(!bookmark);

    await supabase.rpc("toggle_video_bookmark_v2", {
      p_student_id: user.id,
      p_videocard_id: phase.id,
      p_subject: phase.subject,
    });
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setFullScreen(true)}>
        <Video
          ref={inlineRef}
          style={styles.video}
          source={{ uri: videoUrl }}
          posterSource={{ uri: posterUrl }}
          usePoster={!!posterUrl}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          rate={speed}
          onPlaybackStatusUpdate={handlePlayback}
        />
      </TouchableOpacity>

      {speedControls && (
        <View style={styles.speedRow}>
          {[1, 1.25, 1.5, 2].map((s) => (
            <TouchableOpacity key={s} onPress={() => setSpeed(s)}>
              <Text
                style={[
                  styles.speedBtn,
                  speed === s && styles.speedActive,
                ]}
              >
                {s}×
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={toggleLike}>
          <Heart
            size={24}
            color={liked ? "#ff5c8a" : "#aaa"}
            fill={liked ? "#ff5c8a" : "transparent"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleBookmark}>
          <Bookmark
            size={24}
            color="#10b981"
            fill={bookmark ? "#10b981" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={fullScreen} animationType="slide">
        <View style={styles.fullBox}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setFullScreen(false)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>

          <Video
            ref={fullscreenRef}
            style={styles.fullVideo}
            source={{ uri: videoUrl }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            rate={speed}
            onPlaybackStatusUpdate={handlePlayback}
          />
        </View>
      </Modal>
    </View>
  );
}

/* --------------------------------------------------
   EXPORTS (THIS IS THE FIX)
-------------------------------------------------- */
export default VideoScreen;
export { VideoScreen as VideoCard };

/* --------------------------------------------------
   STYLES
-------------------------------------------------- */
const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    backgroundColor: "black",
  },
  speedRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  speedBtn: {
    color: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#555",
  },
  speedActive: {
    color: "white",
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  actionRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
    alignItems: "center",
  },
  fullBox: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullVideo: {
    width: "100%",
    height: "100%",
  },
});
