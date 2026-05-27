import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import logoText from "../assets/logo-text.png";
import API from "../config/api";

// ── Password strength validator ──
function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

// ── Password Strength Bar ──
function PasswordStrengthBar({ password }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (password.length === 0) return null;

  return (
    <View style={strength.container}>
      <View style={strength.barRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              strength.bar,
              { backgroundColor: i < passed ? colors[passed - 1] : "rgba(255,255,255,0.2)" },
            ]}
          />
        ))}
      </View>
      <Text style={[strength.label, { color: colors[passed - 1] || "rgba(255,255,255,0.5)" }]}>
        {passed > 0 ? labels[passed - 1] : "Too weak"}
      </Text>
      <View style={strength.list}>
        {[
          { key: "length", text: "At least 8 characters" },
          { key: "uppercase", text: "One uppercase letter" },
          { key: "number", text: "One number" },
          { key: "special", text: "One special character (!@#$...)" },
        ].map(({ key, text }) => (
          <Text
            key={key}
            style={[strength.item, checks[key] ? strength.itemValid : strength.itemInvalid]}
          >
            {checks[key] ? "✓" : "○"} {text}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Fetch with timeout + retry ──
async function fetchWithRetry(url, options, timeoutMs = 40000, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      const isLast = attempt === retries;
      if (isLast) throw err;
      // wait 2s before retrying
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);

  // Wake up Render as soon as screen loads
  useEffect(() => {
    fetch(`${API}/api/auth/ping`).catch(() => {});
  }, []);

  const handleSignup = async () => {
    setMessage("");
    setIsError(true);

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    const strengthError = validatePassword(password);
    if (strengthError) {
      setMessage(strengthError);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Show "slow server" warning after 6 seconds
    const slowTimer = setTimeout(() => {
      setIsError(false);
      setMessage("Server is waking up, please wait...");
    }, 6000);

    try {
      const response = await fetchWithRetry(
        `${API}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        },
        40000, // 40s timeout per attempt
        2      // retry once if it fails
      );

      clearTimeout(slowTimer);
      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage(data.message || "Verification code sent to your email.");
        router.push({ pathname: "/verify", params: { email: email.trim().toLowerCase() } });
      } else {
        setIsError(true);
        setMessage(data.message || data.detail || "Registration failed.");
      }
    } catch (err) {
      clearTimeout(slowTimer);
      setIsError(true);
      if (err.name === "AbortError") {
        setMessage("Server is taking too long. Please try again.");
      } else {
        setMessage("Cannot connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
      setMessage((prev) =>
        prev === "Server is waking up, please wait..." ? "" : prev
      );
    }
  };

  return (
    <LinearGradient
      colors={["#4da3f5", "#2bbbad"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoText} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Heading */}
          <Text style={styles.headingText}>Create your Account</Text>
          <Text style={styles.subtitleText}>
            Join Coursify and start learning today
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <InputField
              placeholder="Username"
              value={username}
              onChangeText={(t) => { setUsername(t); setMessage(""); }}
              autoCapitalize="none"
              autoCorrect={false}
              icon="person-outline"
            />
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={(t) => { setEmail(t); setMessage(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail-outline"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); setMessage(""); }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock-closed-outline"
            />

            <PasswordStrengthBar password={password} />

            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setMessage(""); }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock-closed-outline"
            />

            {message ? (
              <Text style={[styles.messageText, !isError && styles.messageSuccess]}>
                {message}
              </Text>
            ) : null}

            <Button
              title={loading ? "Please wait..." : "Sign Up"}
              onPress={handleSignup}
              loading={loading}
            />
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: 28,
    zIndex: 10,
    padding: 4,
  },
  backArrow: { fontSize: 24, color: "#fff", fontWeight: "600" },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  logo: { width: 160, height: 50 },
  headingText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  footerLink: { color: "#FBB217", fontSize: 14, fontWeight: "700" },
  messageText: {
    color: "#FFE082",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  messageSuccess: {
    color: "#a7f3d0",
  },
});

const strength = StyleSheet.create({
  container: { marginBottom: 12, marginTop: -4 },
  barRow: { flexDirection: "row", gap: 4, marginBottom: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 11, marginBottom: 4 },
  list: { gap: 2 },
  item: { fontSize: 11 },
  itemValid: { color: "#a7f3d0" },
  itemInvalid: { color: "rgba(255,255,255,0.45)" },
});