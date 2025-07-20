import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateName, validatePassword, validateConfirmPassword } from '../utils/validation';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import { SignupScreenProps, SignupFormData } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleInputChange = (field: keyof SignupFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (): Promise<void> => {
    if (!validateForm()) return;
    
    try {
      const result = await signup(formData.name, formData.email, formData.password);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('Home'),
            },
          ]
        );
      } else {
        Alert.alert('Signup Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const navigateToLogin = (): void => {
    navigation.navigate('Login');
  };

  const handleTermsPress = (): void => {
    Alert.alert('Terms of Service', 'Terms of Service will be displayed here.');
  };

  const handlePrivacyPress = (): void => {
    Alert.alert('Privacy Policy', 'Privacy Policy will be displayed here.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="receipt-long" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start tracking your expenses
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.name}
              leftIcon={
                <Icon name="person" size={20} color={COLORS.gray} />
              }
              required
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              leftIcon={
                <Icon name="email" size={20} color={COLORS.gray} />
              }
              required
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              error={errors.password}
              leftIcon={
                <Icon name="lock" size={20} color={COLORS.gray} />
              }
              rightIcon={
                <Icon 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color={COLORS.gray} 
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              error={errors.confirmPassword}
              leftIcon={
                <Icon name="lock-outline" size={20} color={COLORS.gray} />
              }
              rightIcon={
                <Icon 
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color={COLORS.gray} 
                />
              }
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  keyboardContainer: {
    flex: 1,
  } as ViewStyle,
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  } as ViewStyle,
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  } as ViewStyle,
  title: {
    fontSize: FONTS.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  } as TextStyle,
  subtitle: {
    fontSize: FONTS.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  } as TextStyle,
  form: {
    flex: 1,
    paddingTop: SPACING.md,
  } as ViewStyle,
  termsContainer: {
    marginVertical: SPACING.md,
  } as ViewStyle,
  termsText: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  } as TextStyle,
  termsLink: {
    color: COLORS.primary,
    fontWeight: '500',
  } as TextStyle,
  signupButton: {
    marginTop: SPACING.md,
  } as ViewStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  footerText: {
    fontSize: FONTS.medium,
    color: COLORS.textLight,
  } as TextStyle,
  loginLink: {
    fontSize: FONTS.medium,
    color: COLORS.primary,
    fontWeight: '600',
  } as TextStyle,
});

export default SignupScreen;