import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field, SectionTitle } from '@/components/ui';
import { C, LINKS, S } from '@/constants/theme';
import { useStore, type BusinessProfile } from '@/lib/store';

const FIELDS: { key: keyof BusinessProfile; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'name', label: 'Business name', placeholder: 'e.g. Bright Day Cleaning' },
  { key: 'owner', label: 'Your name (for sign-offs)', placeholder: 'e.g. Kenny' },
  { key: 'services', label: 'What you do', placeholder: 'Services, prices, hours, service area', multiline: true },
  { key: 'location', label: 'Location', placeholder: 'City, state' },
  { key: 'contact', label: 'Contact details', placeholder: 'Phone, email, website' },
  { key: 'tone', label: 'Your voice', placeholder: 'e.g. friendly, plain-spoken, no exclamation marks' },
  { key: 'avoid', label: 'Never say or promise', placeholder: 'e.g. same-day service, discounts over 20%' },
];

export default function ProfileScreen() {
  const { profile, saveProfile, clearAll } = useStore();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [synced, setSynced] = useState(profile);

  // Reset the form when the stored profile changes (e.g. after "Delete all my data").
  if (synced !== profile) {
    setSynced(profile);
    setDraft(profile);
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  async function onSave() {
    await saveProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onClear() {
    Alert.alert('Delete all my data?', 'This removes your business details and run history from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => clearAll() },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
        <Text style={st.lead}>Fill this in once. Every agent uses it, so replies, invoices and posts come back ready to use.</Text>
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            testID={`profile-${f.key}`}
            label={f.label}
            placeholder={f.placeholder}
            multiline={f.multiline}
            value={draft[f.key]}
            onChangeText={(t) => setDraft((d) => ({ ...d, [f.key]: t }))}
          />
        ))}
        <Button testID="save-profile" label={saved ? 'Saved' : 'Save'} icon={saved ? 'checkmark' : 'save-outline'} onPress={onSave} disabled={!dirty && !saved} />

        <View style={st.block}>
          <SectionTitle>Privacy</SectionTitle>
          <Text style={st.body}>
            Your details and history are stored only on this phone. When you run an agent, what you enter is sent to TreasureRate to
            generate the result.
          </Text>
          <View style={st.links}>
            <Text style={st.link} onPress={() => Linking.openURL(LINKS.privacy)}>
              Privacy Policy
            </Text>
            <Text style={st.link} onPress={() => Linking.openURL(LINKS.terms)}>
              Terms
            </Text>
            <Text style={st.link} onPress={() => Linking.openURL(LINKS.support)}>
              Support
            </Text>
          </View>
          <Button label="Delete all my data" icon="trash-outline" variant="secondary" onPress={onClear} />
        </View>
        <Text style={st.version}>TreasureRate Back Office {Constants.expoConfig?.version ?? ''}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: S.lg, gap: S.lg, paddingBottom: S.xxl * 2 },
  lead: { color: C.muted, fontSize: 14, lineHeight: 20 },
  block: { gap: S.md, marginTop: S.lg },
  body: { color: C.muted, fontSize: 13, lineHeight: 19 },
  links: { flexDirection: 'row', gap: S.xl },
  link: { color: C.gold, fontWeight: '700' },
  version: { color: C.faint, fontSize: 12, textAlign: 'center' },
});
