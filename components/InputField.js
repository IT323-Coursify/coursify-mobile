import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  icon,
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      {/* Left Icon */}
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color="rgba(255,255,255,0.65)"
          style={styles.leftIcon}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !passwordVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Right toggle for password */}
      {isPassword && (
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="rgba(255,255,255,0.65)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  containerFocused: {
    borderColor: "rgba(255, 255, 255, 0.75)",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 6,
  },
});

export default InputField;