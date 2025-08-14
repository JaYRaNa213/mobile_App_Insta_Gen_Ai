// =============================
// FILE: mobile/src/screens/Home.tsx
// =============================
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMediaStore } from '../store';

export default function Home() {
  const nav = useNavigation();
  const items = useMediaStore((s) => s.items);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>InstaGen</Text>

      <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Camera' as never)}>
        <Text style={styles.buttonText}>Capture / Upload</Text>
      </TouchableOpacity>

      <FlatList
        style={{ width: '100%' }}
        data={items}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.type.toUpperCase()} • {item.status}</Text>
            <Text numberOfLines={2}>{item.key}</Text>
          </View>
        )}
        
        ListEmptyComponent={<Text style={{ marginTop: 24, color: '#666' }}>No media yet. Upload something!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 16 },
  button: { backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '600' },
  card: { width: '100%', padding: 12, borderRadius: 12, backgroundColor: '#f3f4f6', marginTop: 10 },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
});