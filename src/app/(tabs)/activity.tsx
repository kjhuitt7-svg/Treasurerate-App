import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { Card } from '@/components/ui';
import { C, S } from '@/constants/theme';
import { formatMinutes } from '@/lib/agents';
import { useStore } from '@/lib/store';

export default function ActivityScreen() {
  const { runs } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const total = runs.reduce((s, r) => s + r.minutesSaved, 0);

  if (runs.length === 0) {
    return (
      <View style={st.empty}>
        <Text style={st.emptyTitle}>No runs yet</Text>
        <Text style={st.emptyBody}>Your results and time saved will show up here.</Text>
        <Text style={st.link} onPress={() => router.push('/')}>
          Pick an agent
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={runs}
      keyExtractor={(r) => r.id}
      contentContainerStyle={st.wrap}
      ListHeaderComponent={
        <Text style={st.total}>
          {runs.length} run{runs.length === 1 ? '' : 's'} · about {formatMinutes(total)} saved (est.)
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => setOpen(open === item.id ? null : item.id)} accessibilityRole="button">
          <Card style={{ gap: S.xs }}>
            <View style={st.rowTop}>
              <Text style={st.name}>{item.agentName}</Text>
              <Text style={st.saves}>~{formatMinutes(item.minutesSaved)}</Text>
            </View>
            <Text style={st.when}>{new Date(item.at).toLocaleString()}</Text>
            {item.preview ? (
              <Text style={st.preview} numberOfLines={open === item.id ? undefined : 2}>
                {item.preview}
              </Text>
            ) : null}
            {open === item.id ? (
              <View style={st.out}>
                <Markdown style={md}>{item.output}</Markdown>
              </View>
            ) : null}
          </Card>
        </Pressable>
      )}
    />
  );
}

const st = StyleSheet.create({
  wrap: { padding: S.lg, gap: S.sm, paddingBottom: S.xxl * 2 },
  total: { color: C.gold, fontWeight: '700', marginBottom: S.sm },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { color: C.text, fontWeight: '700', fontSize: 15 },
  saves: { color: C.gold, fontSize: 12, fontWeight: '700' },
  when: { color: C.faint, fontSize: 12 },
  preview: { color: C.muted, fontSize: 13 },
  out: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, marginTop: S.sm, paddingTop: S.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: S.xl, gap: S.sm },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
  emptyBody: { color: C.muted, textAlign: 'center' },
  link: { color: C.gold, fontWeight: '700', marginTop: S.sm },
});

const md = StyleSheet.create({
  body: { color: C.text, fontSize: 14, lineHeight: 20 },
  heading1: { color: C.text, fontSize: 18, fontWeight: '800' },
  heading2: { color: C.text, fontSize: 16, fontWeight: '800' },
  th: { padding: 4, color: C.text, fontWeight: '700' },
  td: { padding: 4, borderColor: C.border },
  table: { borderColor: C.border },
  tr: { borderColor: C.border },
});
