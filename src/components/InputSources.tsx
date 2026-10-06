import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { extractTextFromImage, isSupported as ocrSupported } from 'expo-text-extractor';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/constants/theme';

/** Longest text we pull in from one file or photo batch, to keep agent inputs reasonable. */
const MAX_CHARS = 30000;
const MAX_PHOTOS = 5;

const TEXT_TYPES = ['text/*', 'application/json', 'application/rtf', 'message/rfc822'];
const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|rtf|eml|html?|xml|log)$/i;

type Source = 'camera' | 'photos' | 'file';

/**
 * Camera / Photos / Upload buttons that turn a picture or a file into text for a field.
 * Text in photos is read on the device; images are never uploaded.
 */
export function InputSources({ onText, testID }: { onText: (text: string) => void; testID?: string }) {
  const [busy, setBusy] = useState<Source | null>(null);

  async function readImages(uris: string[]) {
    if (!ocrSupported) {
      Alert.alert('Not available here', 'Reading text from photos needs the installed TreasureRate app. Paste or type the text instead.');
      return;
    }
    const pages: string[] = [];
    for (const uri of uris) {
      const lines = await extractTextFromImage(uri);
      const text = lines.join('\n').trim();
      if (text) pages.push(text);
    }
    if (!pages.length) {
      Alert.alert('No text found', 'Try again with the page flat, well lit and filling most of the frame.');
      return;
    }
    deliver(pages.join('\n\n'));
  }

  function deliver(text: string) {
    if (text.length > MAX_CHARS) {
      Alert.alert('Trimmed', 'That was long, so only the first part was added. Check the end of the text before you run.');
      text = text.slice(0, MAX_CHARS);
    }
    onText(text.trim());
  }

  async function run(source: Source, job: () => Promise<void>) {
    if (busy) return;
    setBusy(source);
    try {
      await job();
    } catch {
      Alert.alert('Could not read that', 'Something went wrong reading it. Try again, or paste the text instead.');
    } finally {
      setBusy(null);
    }
  }

  const onCamera = () =>
    run('camera', async () => {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Camera is off', 'Allow camera access in Settings to snap documents.', [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
      if (res.canceled) return;
      await readImages(res.assets.map((a) => a.uri));
    });

  const onPhotos = () =>
    run('photos', async () => {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS,
        quality: 1,
      });
      if (res.canceled) return;
      await readImages(res.assets.map((a) => a.uri));
    });

  const onFile = () =>
    run('file', async () => {
      const res = await DocumentPicker.getDocumentAsync({
        type: [...TEXT_TYPES, 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      const mime = asset.mimeType ?? '';
      if (mime.startsWith('image/')) {
        await readImages([asset.uri]);
        return;
      }
      if (!mime.startsWith('text/') && !TEXT_TYPES.includes(mime) && !TEXT_EXT.test(asset.name)) {
        Alert.alert('File type not supported yet', 'Upload a text file or an image. For a PDF or Word file, take a screenshot and use Photos.');
        return;
      }
      const text = (await new File(asset.uri).text()).trim();
      if (!text) {
        Alert.alert('Empty file', 'That file has no text in it.');
        return;
      }
      deliver(text);
    });

  return (
    <View style={st.row} testID={testID}>
      <Chip label="Camera" icon="camera-outline" busy={busy === 'camera'} disabled={!!busy} onPress={onCamera} />
      <Chip label="Photos" icon="images-outline" busy={busy === 'photos'} disabled={!!busy} onPress={onPhotos} />
      <Chip label="Upload" icon="document-attach-outline" busy={busy === 'file'} disabled={!!busy} onPress={onFile} />
    </View>
  );
}

function Chip({
  label,
  icon,
  busy,
  disabled,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  busy: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: add text from ${label.toLowerCase()}`}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [st.chip, disabled && !busy && { opacity: 0.45 }, pressed && { opacity: 0.75 }]}>
      {busy ? <ActivityIndicator size="small" color={C.gold} /> : <Ionicons name={icon} size={16} color={C.gold} />}
      <Text style={st.chipLabel}>{busy ? 'Reading…' : label}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: S.sm, flexWrap: 'wrap', marginTop: -S.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    minHeight: 36,
    paddingHorizontal: S.md,
    borderRadius: R.pill,
    backgroundColor: C.cardHigh,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  chipLabel: { color: C.text, fontSize: 14, fontWeight: '600' },
});
