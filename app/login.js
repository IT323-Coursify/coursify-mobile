import React, { useState } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import logoText from "../assets/logo-text.png";

const users = [
  {
    email: "student1@coursify.com",
    password: "123456",
    name: "User 1",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    setTimeout(() => {
      setLoading(false);
      if (foundUser) {
        router.replace("/(tabs)/dashboard");
      } else {
        setMessage("Invalid email or password.");
      }
    }, 800);
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoText} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Greeting */}
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitleText}>
            Sign in to continue using Coursify
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={(text) => { setEmail(text); setMessage(""); }}
              keyboardType="email-address"
              icon="mail-outline"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={(text) => { setPassword(text); setMessage(""); }}
              secureTextEntry
              icon="lock-closed-outline"
            />

            {/* Error / info message */}
            {message ? (
              <Text style={styles.messageText}>{message}</Text>
            ) : null}

            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button title="Sign In" onPress={handleLogin} loading={loading} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 160,
    height: 50,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  messageText: {
    color: "#FFE082",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 6,
    marginTop: -4,
  },
  forgotText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  footerLink: {
    color: "#FBB217",
    fontSize: 14,
    fontWeight: "700",
  },
});