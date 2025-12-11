// components/types/VideoScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Bookmark, Heart } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export default function VideoScreen({
  videoUrl,
  posterUrl,
  speedControls = true,
  phaseUniqueId,
  isBookmarked,
  isLiked,
  progress_percent,
}) {
  const { user } = useAuth();

  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [speed, setSpeed] = useState(1.0);
  const [fullScreen, setFullScreen] = useState(false);
  const [bookmark, setBookmark] = useState(isBookmarked);
  const [liked, setLiked] = useState(isLiked);

  const resumePosition =
    progress_percent && progress_percent > 2
      ? progress_percent / 100
      : 0;

  // ⭐ Resume From Last Watched Position
  useEffect(() => {
    if (!videoRef.current) return;

    const load = async () => {
      if (resumePosition > 0) {
        const player = videoRef.current;
        const totalMillis = player._durationMillis;
        if (totalMillis) {
          player.setPositionAsync(resumePosition * totalMillis);
        }
      }
    };

    const timer = setTimeout(load, 800);
    return () => clearTimeout(timer);
  }, [videoRef.current]);

  // ⭐ Report Progress to Supabase
  async function updateProgress(status) {
    if (!user?.id) return;

    if (!status?.positionMillis || !status?.durationMillis) return;

    const percent = Math.floor(
      (status.positionMillis / status.durationMillis) * 100
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

  // ⭐ Like Toggle
  async function toggleLike() {
    if (!user?.id) return;

    setLiked(!liked);

    await supabase.rpc("toggle_video_like_v1", {
      p_student_id: user.id,
      p_phase_id: phaseUniqueId,
    });
  }

  // ⭐ Bookmark Toggle
  async function toggleBookmark() {
    if (!user?.id) return;

    setBookmark(!bookmark);

    await supabase.rpc("toggle_video_bookmark_v1", {
      p_student_id: user.id,
      p_phase_id: phaseUniqueId,
    });
  }

  return (
    <View>
      {/* VIDEO PLAYER */}
      <TouchableOpacity onPress={() => setFullScreen(true)}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUrl }}
          posterSource={{ uri: posterUrl }}
          usePoster={!!posterUrl}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onPlaybackStatusUpdate={(s) => {
            setStatus(s);
            updateProgress(s);
          }}
          rate={speed}
        />
      </TouchableOpacity>

      {/* SPEED CONTROLS */}
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

      {/* LIKE + BOOKMARK */}
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

      {/* FULL SCREEN MODAL */}
      <Modal visible={fullScreen} animationType="slide">
        <View style={styles.fullBox}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setFullScreen(false)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>

          <Video
            ref={videoRef}
            style={styles.fullVideo}
            source={{ uri: videoUrl }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            onPlaybackStatusUpdate={(s) => {
              setStatus(s);
              updateProgress(s);
            }}
            rate={speed}
          />
        </View>
      </Modal>
    </View>
  );
}

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
