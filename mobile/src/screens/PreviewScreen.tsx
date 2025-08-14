
// =============================
// FILE: mobile/src/screens/PreviewScreen.tsx
// =============================
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { api } from '../services/api';

export default function PreviewScreen({ route }: any) {
  const { id } = route.params || {};
  const [media, setMedia] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const poll = React.useCallback(async () => {
    try {
      const res = await api.getMedia(id);
      setMedia(res);
      if (res.status !== 'done') {
        setTimeout(poll, 2500);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setTimeout(poll, 3000);
    }
  }, [id]);

  React.useEffect(() => {
    poll();
  }, [poll]);

  if (loading && !media) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Waiting for analysis…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Suggestions</Text>
      {media?.thumbnailUrl && (
        <Image source={{ uri: media.thumbnailUrl }} style={styles.preview} />
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detected</Text>
        <Text>Scene: {media?.meta?.vision?.scene || media?.meta?.scene || '—'}</Text>
        <Text>Objects: {(media?.meta?.vision?.objects || []).join(', ')}</Text>
        <Text>Sentiment: {media?.meta?.vision?.sentiment || media?.meta?.sentiment || '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        <Text>Filter: {media?.meta?.filter?.name || 'Auto'}</Text>
        <Text>Emojis: {(media?.meta?.emojis || []).join(' ')}</Text>
        {media?.meta?.musicRecommendation?.title && (
          <Text>Music: {media.meta.musicRecommendation.title}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.primary}><Text style={{ color: '#fff', fontWeight: '700' }}>Save / Share</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  preview: { width: '100%', height: 300, borderRadius: 12, backgroundColor: '#e5e7eb' },
  card: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12 },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  primary: { backgroundColor: '#111827', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
});

