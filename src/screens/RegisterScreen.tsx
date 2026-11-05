import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { register } from "../services/authService"; // đã viết sẵn: register(name, email, password)
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { validateEmail, validatePassword, validateRequired } from "../utils/validators";
import { RootScreenProps } from "../navigation/types";
import { colors } from "../theme";

export function RegisterScreen({ navigation, route }: RootScreenProps<"Register">) {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const errName = validateRequired("họ tên")(name);
    const errEmail = validateEmail(email);
    const errPass = validatePassword(password);
    const errConfirm = !confirm
      ? "Vui lòng nhập lại mật khẩu"
      : confirm !== password
      ? "Mật khẩu nhập lại không khớp"
      : null;

    setErrors({
      name: errName,
      email: errEmail,
      password: errPass,
      confirm: errConfirm,
    });

    if (errName || errEmail || errPass || errConfirm) return;

    setSubmitError(null);
    setLoading(true);
    try {
      const { user, token } = await register(name, email, password);
      signIn(user, token);
      if (route.params?.redirectTo === "Checkout") {
        navigation.replace("Checkout", { total: route.params.total ?? 0 });
      } else {
        navigation.navigate("Tabs", { screen: "Home" });
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Tạo tài khoản mới</Text>

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <FormField
          label="Họ tên"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
          }}
          placeholder="vd: Nguyễn Văn A"
          error={errors.name}
        />

        <FormField
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="vd: demo@bookstore.vn"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormField
          label="Mật khẩu"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="Tối thiểu 6 ký tự"
          secureTextEntry
          error={errors.password}
        />

        <FormField
          label="Nhập lại mật khẩu"
          value={confirm}
          onChangeText={(text) => {
            setConfirm(text);
            if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: null }));
          }}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          error={errors.confirm}
        />

        <PrimaryButton title="Đăng ký" onPress={handleSubmit} loading={loading} />

        <Pressable onPress={() => navigation.replace("Login", route.params)}>
          <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 22, fontWeight: "800", color: colors.navy, textAlign: "center", marginBottom: 6 },
  submitError: { color: colors.danger, textAlign: "center" },
  link: { color: colors.indigo, fontWeight: "700", textAlign: "center" },
});
