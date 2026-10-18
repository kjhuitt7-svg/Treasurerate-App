import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

import { C, R, S } from '@/constants/theme';
import { HERO_IMAGES } from '@/lib/heroes';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  loading,
  testID,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}) {
  const primary = variant === 'primary';
  const color = primary ? C.bg : variant === 'ghost' ? C.muted : C.text;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        primary && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || loading) && { opacity: 0.45 },
        pressed && { opacity: 0.75 },
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
          <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  ...props
}: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={{ gap: S.xs }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={C.faint}
        style={[styles.input, props.multiline && styles.inputMulti]}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

export function IconBadge({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={name} size={size} color={C.gold} />
    </View>
  );
}

/** The agent's hero portrait, or its icon if no portrait exists. */
export function HeroAvatar({ id, icon, size = 52, label }: { id: string; icon: IconName; size?: number; label?: string }) {
  const src = HERO_IMAGES[id];
  if (!src) return <IconBadge name={icon} />;
  return (
    <Image
      source={src}
      accessibilityLabel={label}
      style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: C.gold }}
      contentFit="cover"
    />
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    padding: S.lg,
  },
  button: {
    minHeight: 48,
    borderRadius: R.pill,
    paddingHorizontal: S.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
  },
  buttonPrimary: { backgroundColor: C.gold },
  buttonSecondary: { backgroundColor: C.cardHigh, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  buttonGhost: { backgroundColor: 'transparent', minHeight: 40, paddingHorizontal: S.md },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  label: { color: C.text, fontSize: 14, fontWeight: '600' },
  hint: { color: C.faint, fontSize: 12 },
  input: {
    backgroundColor: C.cardHigh,
    borderRadius: R.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    color: C.text,
    fontSize: 16,
    paddingHorizontal: S.md,
    paddingVertical: S.md,
    minHeight: 48,
  },
  inputMulti: { minHeight: 120 },
  section: { color: C.muted, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  badge: {
    width: 44,
    height: 44,
    borderRadius: R.md,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
