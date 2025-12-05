import { View, Modal, StyleSheet, Pressable, Text, Platform, Linking } from 'react-native';
import { X, Share2, Download, Forward, Highlighter } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

interface DocumentViewerProps {
  visible: boolean;
  fileName: string;
  fileUri: string;
  mimeType?: string;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onForward?: () => void;
  onHighlight?: () => void;
}

export default function DocumentViewer({
  visible,
  fileName,
  fileUri,
  mimeType,
  onClose,
  onShare,
  onDownload,
  onForward,
  onHighlight,
}: DocumentViewerProps) {
  const handleOpenExternal = () => {
    if (Platform.OS === 'web') {
      window.open(fileUri, '_blank');
    } else {
      Linking.openURL(fileUri);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={onClose}>
            <X size={24} color="#e5e7eb" strokeWidth={2} />
          </Pressable>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
          <View style={styles.headerButtons}>
            {onHighlight && (
              <Pressable style={styles.headerButton} onPress={onHighlight}>
                <Highlighter size={22} color="#e5e7eb" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {Platform.OS === 'web' ? (
            <WebView
              source={{ uri: fileUri }}
              style={styles.webview}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Document preview not available
              </Text>
              <Pressable style={styles.openButton} onPress={handleOpenExternal}>
                <Text style={styles.openButtonText}>Open Externally</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {onShare && (
            <Pressable style={styles.footerButton} onPress={onShare}>
              <Share2 size={24} color="#e5e7eb" strokeWidth={2} />
              <Text style={styles.footerButtonText}>Share</Text>
            </Pressable>
          )}
          {onDownload && (
            <Pressable style={styles.footerButton} onPress={onDownload}>
              <Download size={24} color="#e5e7eb" strokeWidth={2} />
              <Text style={styles.footerButtonText}>Download</Text>
            </Pressable>
          )}
          {onForward && (
            <Pressable style={styles.footerButton} onPress={onForward}>
              <Forward size={24} color="#e5e7eb" strokeWidth={2} />
              <Text style={styles.footerButtonText}>Forward</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
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
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginHorizontal: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  openButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#25D366',
    borderRadius: 8,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b141a',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: '#111b21',
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  footerButton: {
    alignItems: 'center',
    gap: 6,
  },
  footerButtonText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
