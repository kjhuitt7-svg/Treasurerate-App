import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { C, S } from '@/constants/theme';
import { useStore } from '@/lib/store';

export default function ConsentScreen() {
  const { giveConsent } = useStore();

  async function agree() {
    await giveConsent();
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Text style={st.title} accessibilityRole="header">
        How your text is used
      </Text>
      <Text style={st.body}>
        To write a result, Back Office sends the text you enter, plus your business details from My Business, to TreasureRate. TreasureRate
        shares it with third-party AI providers (such as OpenAI and Anthropic) so they can generate the result.
      </Text>
      <View style={st.points}>
        <Text style={st.point}>• Photos and files are read on your phone. Only the text you choose to submit is sent.</Text>
        <Text style={st.point}>• Your text is not used to train TreasureRate&apos;s own AI models.</Text>
        <Text style={st.point}>• Your history stays on this phone. Delete it any time from My Business.</Text>
        <Text style={st.point}>• Please do not enter sensitive data like health records or card numbers.</Text>
      </View>
      <Text style={st.link} accessibilityRole="link" onPress={() => router.push('/legal/privacy')}>
        Read the Privacy Policy
      </Text>
      <Button testID="consent-agree" label="I agree, continue" icon="checkmark" onPress={agree} />
      <Button label="Not now" variant="ghost" onPress={() => router.back()} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: S.lg, gap: S.lg, paddingBottom: S.xxl * 2 },
  title: { color: C.text, fontSize: 24, fontWeight: '800' },
  body: { color: C.muted, fontSize: 15, lineHeight: 22 },
  points: { gap: S.sm },
  point: { color: C.text, fontSize: 14, lineHeight: 21 },
  link: { color: C.gold, fontWeight: '700' },
});
