
// =============================
// FILE: mobile/src/screens/CameraScreen.tsx
// =============================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadMedia } from '../services/media';
import { useNavigation } from '@react-navigation/native';

import { useMediaStore } from '../store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';



export default function CameraScreen() {
  const [uri, setUri] = React.useState<string | null>(null);
  const nav = useNavigation<CameraScreenNavProp>();

  const [busy, setBusy] = React.useState(false);
  type CameraScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

  const add = useMediaStore((s) => s.add);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.9,
    });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  const capture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to continue.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9 });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  const upload = async () => {
    if (!uri) return;
    try {
      setBusy(true);
      const media = await uploadMedia(uri); // { _id, status, ... }
      add(media);
      // Go to preview for this media
      nav.navigate('Preview', { id: media._id });

    } catch (e: any) {
      Alert.alert('Upload failed', e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={capture}><Text style={styles.buttonText}>Use Camera</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pick}><Text style={styles.buttonText}>Pick from Gallery</Text></TouchableOpacity>
      </View>

      {uri && (
        <Image source={{ uri }} style={{ width: 300, height: 300, borderRadius: 12, marginVertical: 16 }} />
      )}

      <TouchableOpacity style={[styles.button, { opacity: uri && !busy ? 1 : 0.5 }]} disabled={!uri || busy} onPress={upload}>
        <Text style={styles.buttonText}>{busy ? 'Uploading…' : 'Upload & Analyze'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  row: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, marginTop: 12 },
  buttonText: { color: 'white', fontWeight: '600' },
});

