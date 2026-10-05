import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, IconBadge, SectionTitle, type IconName } from '@/components/ui';
import { C, R, S } from '@/constants/theme';
import { AGENTS, GROUPS, formatMinutes } from '@/lib/agents';
import { profileFilled, useStore } from '@/lib/store';

export default function AgentsScreen() {
  const { runs, profile } = useStore();
  const saved = runs.reduce((s, r) => s + r.minutesSaved, 0);

  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Card style={st.hero}>
        <Text style={st.heroLabel}>Time saved so far (est.)</Text>
        <Text style={st.heroValue} testID="hours-saved">
          {formatMinutes(saved)}
        </Text>
        <Text style={st.heroSub}>
          {runs.length === 0 ? 'Run your first agent to start the count.' : `Across ${runs.length} run${runs.length === 1 ? '' : 's'}`}
        </Text>
      </Card>

      {!profileFilled(profile) ? (
        <Pressable onPress={() => router.push('/profile')} accessibilityRole="button">
          <Card style={st.nudge}>
            <Ionicons name="storefront-outline" size={20} color={C.gold} />
            <View style={{ flex: 1 }}>
              <Text style={st.nudgeTitle}>Tell us about your business</Text>
              <Text style={st.nudgeBody}>Every agent uses it, so results come back ready to use.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </Card>
        </Pressable>
      ) : null}

      {GROUPS.map((g) => (
        <View key={g} style={{ gap: S.sm }}>
          <SectionTitle>{g}</SectionTitle>
          {AGENTS.filter((a) => a.group === g).map((a) => (
            <Pressable
              key={a.id}
              testID={`agent-${a.id}`}
              accessibilityRole="button"
              accessibilityLabel={`${a.name}. ${a.tagline}`}
              onPress={() => router.push({ pathname: '/agent/[id]', params: { id: a.id } })}
              style={({ pressed }) => pressed && { opacity: 0.8 }}>
              <Card style={st.row}>
                <IconBadge name={a.icon as IconName} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={st.name}>{a.name}</Text>
                  <Text style={st.tagline}>{a.tagline}</Text>
                </View>
                <Text style={st.saves}>~{formatMinutes(a.minutesSaved)}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      ))}
      <Text style={st.foot}>Time estimates are per run and approximate.</Text>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: S.lg, gap: S.xl, paddingBottom: S.xxl * 2 },
  hero: { backgroundColor: C.goldSoft, borderColor: 'rgba(212,175,55,0.35)', gap: S.xs },
  heroLabel: { color: C.muted, fontSize: 13, fontWeight: '600' },
  heroValue: { color: C.gold, fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  heroSub: { color: C.muted, fontSize: 13 },
  nudge: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  nudgeTitle: { color: C.text, fontWeight: '700', fontSize: 15 },
  nudgeBody: { color: C.muted, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  name: { color: C.text, fontSize: 16, fontWeight: '700' },
  tagline: { color: C.muted, fontSize: 13 },
  saves: { color: C.gold, fontSize: 12, fontWeight: '700', backgroundColor: C.goldSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: R.pill, overflow: 'hidden' },
  foot: { color: C.faint, fontSize: 12, textAlign: 'center' },
});
