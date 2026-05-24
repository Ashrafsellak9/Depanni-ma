import { useCallback, useRef } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(LENGTH, " ").slice(0, LENGTH).split("");

  const focusAt = (index: number) => {
    inputs.current[index]?.focus();
  };

  const updateCode = useCallback(
    (next: string) => {
      const cleaned = next.replace(/\D/g, "").slice(0, LENGTH);
      onChange(cleaned);
      if (cleaned.length < LENGTH) {
        focusAt(cleaned.length);
      }
    },
    [onChange],
  );

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pasted = text.replace(/\D/g, "");
      if (pasted.length >= LENGTH) {
        updateCode(pasted.slice(0, LENGTH));
        focusAt(LENGTH - 1);
      } else {
        const merged =
          value.slice(0, index) + pasted + value.slice(index + pasted.length);
        updateCode(merged);
      }
      return;
    }

    const next =
      value.slice(0, index) + (text.replace(/\D/g, "") || "") + value.slice(index + 1);
    updateCode(next.replace(/\s/g, ""));
    if (text && index < LENGTH - 1) focusAt(index + 1);
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      focusAt(index - 1);
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          style={[styles.cell, digits[index]?.trim() ? styles.cellFilled : null]}
          value={digits[index]?.trim() ?? ""}
          onChangeText={(t) => handleChange(t, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={index === 0 ? LENGTH : 1}
          selectTextOnFocus
          editable={!disabled}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cell: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    backgroundColor: "#fff",
  },
  cellFilled: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
  },
});
