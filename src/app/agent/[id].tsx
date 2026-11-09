import * as Clipboard from 'expo-clipboard';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { InputSources } from '@/components/InputSources';
import { Button, Card, Field, HeroAvatar, type IconName } from '@/components/ui';
import { C, R, S } from '@/constants/theme';
import { RunError, runAgent } from '@/lib/api';
import { buildInput, formatMinutes, getAgent } from '@/lib/agents';
import { creditCost } from '@/lib/billing';
import { profileFilled, useStore } from '@/lib/store';
import { useWallet } from '@/lib/wallet';

export default function AgentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = getAgent(String(id));
  const { profile, addRun } = useStore();
  const wallet = useWallet();
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => () => abort.current?.abort(), []);

  if (!agent) {
    return (
      <View style={st.center}>
        <Text style={st.muted}>Agent not found.</Text>
      </View>
    );
  }

  const missing = agent.fields.filter((f) => f.required && !values[f.key]?.trim());

  async function onRun() {
    if (!agent || missing.length) return;
    const cost = creditCost(agent);
    const paid = await wallet.charge(cost);
    if (!paid) {
      router.push({ pathname: '/paywall', params: { need: String(cost) } });
      return;
    }
    setError(null);
    setOutput('');
    setCopied(false);
    setRunning(true);
    abort.current = new AbortController();
    try {
      const text = await runAgent(agent.num, buildInput(agent, values, profile), setOutput, abort.current.signal);
      const first = agent.fields[0];
      await addRun({
        agentId: agent.id,
        agentName: `${agent.hero} · ${agent.name}`,
        minutesSaved: agent.minutesSaved,
        preview: (values[first.key] ?? '').trim().slice(0, 80),
        output: text,
      });
      AccessibilityInfo.announceForAccessibility(`${agent.hero} finished. Your result is ready below.`);
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    } catch (e) {
      // A failed or cancelled run doesn't cost anything.
      await wallet.refund(paid);
      if ((e as Error)?.name !== 'AbortError') {
        setError(e instanceof RunError ? e.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setRunning(false);
    }
  }

  async function onCopy() {
    await Clipboard.setStringAsync(output);
    setCopied(true);
  }

  function onReport() {
    const body = encodeURIComponent(`Agent: ${agent!.name}\n\nWhat was wrong:\n\n\n--- Output ---\n${output.slice(0, 1500)}`);
    Linking.openURL(`mailto:support@treasurerate.com?subject=${encodeURIComponent('Report AI output')}&body=${body}`).catch(() =>
      Alert.alert('Report', 'Email support@treasurerate.com with what went wrong.'),
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: agent.hero }} />
      <ScrollView ref={scroll} contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
        <View style={st.head}>
          <HeroAvatar id={agent.id} icon={agent.icon as IconName} size={72} label={agent.hero} />
          <View style={{ flex: 1 }}>
            <Text style={st.job}>{agent.name}</Text>
            <Text style={st.tagline}>{agent.tagline}</Text>
            <Text style={st.saves}>Saves about {formatMinutes(agent.minutesSaved)} per run (est.)</Text>
            {wallet.enabled ? (
              <Text style={st.cost} testID="run-cost" accessibilityRole="button" accessibilityHint="Opens plans and credits" onPress={() => router.push('/paywall')}>
                {wallet.unlimited
                  ? 'Unlimited runs on your plan'
                  : `${creditCost(agent)} credit${creditCost(agent) === 1 ? '' : 's'} per run · ${wallet.freeLeft} free left today${wallet.credits ? ` · ${wallet.credits} purchased` : ''}`}
              </Text>
            ) : null}
          </View>
        </View>

        {!profileFilled(profile) ? (
          <Text style={st.tip} accessibilityRole="button" accessibilityHint="Opens My Business" onPress={() => router.push('/profile')}>
            Tip: add your business details first so results come back without placeholders. Tap to add.
          </Text>
        ) : null}

        {agent.fields.map((f) => (
          <View key={f.key} style={{ gap: S.md }}>
            <Field
              testID={`field-${f.key}`}
              label={f.label}
              placeholder={f.placeholder}
              multiline={f.multiline}
              value={values[f.key] ?? ''}
              onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))}
            />
            {f.multiline ? (
              <InputSources
                testID={`sources-${f.key}`}
                onText={(t) =>
                  setValues((v) => {
                    const cur = v[f.key]?.trim();
                    return { ...v, [f.key]: cur ? `${cur}\n\n${t}` : t };
                  })
                }
              />
            ) : null}
          </View>
        ))}

        <Button
          testID="run"
          label={running ? 'Working…' : output ? 'Run again' : 'Run agent'}
          icon="flash"
          onPress={onRun}
          loading={running && !output}
          disabled={missing.length > 0 || running}
        />

        {error ? (
          <Text style={st.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        {output ? (
          <Card style={{ gap: S.md }}>
            <Markdown style={md}>{output}</Markdown>
            {!running ? (
              <>
                <View style={st.actions}>
                  <Button label={copied ? 'Copied' : 'Copy'} icon={copied ? 'checkmark' : 'copy-outline'} variant="secondary" onPress={onCopy} />
                  <Button label="Share" icon="share-outline" variant="secondary" onPress={() => Share.share({ message: output })} />
                </View>
                <View style={st.actions}>
                  <Button label="Report output" icon="flag-outline" variant="ghost" onPress={onReport} />
                </View>
                <Text style={st.disclaimer}>AI-generated. Review before you send, post or sign anything.</Text>
              </>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: S.lg, gap: S.lg, paddingBottom: S.xxl * 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: C.muted },
  head: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  job: { color: C.gold, fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  tagline: { color: C.text, fontSize: 16, fontWeight: '600' },
  saves: { color: C.gold, fontSize: 13, marginTop: 2 },
  cost: { color: C.muted, fontSize: 12, marginTop: 2 },
  tip: { color: C.muted, fontSize: 13, backgroundColor: C.goldSoft, padding: S.md, borderRadius: R.md, overflow: 'hidden' },
  error: { color: C.danger, fontSize: 14 },
  actions: { flexDirection: 'row', gap: S.sm, flexWrap: 'wrap' },
  disclaimer: { color: C.faint, fontSize: 12 },
});

const md = StyleSheet.create({
  body: { color: C.text, fontSize: 15, lineHeight: 22 },
  heading1: { color: C.text, fontSize: 22, fontWeight: '800', marginVertical: 6 },
  heading2: { color: C.text, fontSize: 19, fontWeight: '800', marginVertical: 6 },
  heading3: { color: C.gold, fontSize: 16, fontWeight: '700', marginVertical: 4 },
  strong: { fontWeight: '700' },
  link: { color: C.gold },
  bullet_list: { marginVertical: 4 },
  table: { borderColor: C.border, borderRadius: 6 },
  thead: { backgroundColor: C.cardHigh },
  th: { padding: 6, color: C.text, fontWeight: '700' },
  td: { padding: 6, borderColor: C.border },
  tr: { borderColor: C.border },
  code_inline: { backgroundColor: C.cardHigh, color: C.text },
  fence: { backgroundColor: C.cardHigh, color: C.text, borderColor: C.border },
  hr: { backgroundColor: C.border },
  blockquote: { backgroundColor: C.cardHigh, borderColor: C.gold },
});
