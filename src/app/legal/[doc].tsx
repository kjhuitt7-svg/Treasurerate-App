import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { C, LINKS, S } from '@/constants/theme';
import { LEGAL } from '@/lib/legal';

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const d = doc === 'privacy' ? LEGAL.privacy : LEGAL.terms;
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Stack.Screen options={{ title: d.title }} />
      <Text style={st.title} accessibilityRole="header">
        {d.title}
      </Text>
      <Text style={st.meta}>{d.updated === 'See full policy online' ? d.updated : `Last updated ${d.updated}`}</Text>
      <Text style={st.body}>{d.intro}</Text>
      {d.sections.map((s) => (
        <View key={s.heading} style={st.section}>
          <Text style={st.heading} accessibilityRole="header">
            {s.heading}
          </Text>
          <Text style={st.body}>{s.body}</Text>
        </View>
      ))}
      <Button
        label="Read the full text online"
        icon="open-outline"
        variant="secondary"
        onPress={() => WebBrowser.openBrowserAsync(LINKS[d.webKey])}
      />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: S.lg, gap: S.md, paddingBottom: S.xxl * 2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800' },
  meta: { color: C.faint, fontSize: 12 },
  section: { gap: S.xs, marginTop: S.sm },
  heading: { color: C.gold, fontSize: 15, fontWeight: '700' },
  body: { color: C.muted, fontSize: 14, lineHeight: 21 },
});
