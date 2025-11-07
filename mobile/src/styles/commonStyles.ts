import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from './theme';

/**
 * Common Styles
 * Reusable style definitions that match the web app's design
 */

export const commonStyles = StyleSheet.create({
  // Container styles
  gradientContainer: {
    flex: 1,
    // Note: Use LinearGradient component for actual gradient backgrounds
    backgroundColor: Colors.primary,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },

  // Card styles
  authCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xlarge,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 450,
    ...Shadows.medium,
  },

  wideCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xlarge,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 800,
    ...Shadows.medium,
  },

  // Logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xlarge,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Icon container styles
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  sectionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text styles
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    color: Colors.text,
    letterSpacing: 1,
  },

  sectionTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    color: Colors.text,
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: FontSizes.regular,
    textAlign: 'center',
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },

  instructionText: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
    color: Colors.textLight,
    marginBottom: Spacing.xl,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  errorMessage: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: FontSizes.regular,
  },

  successMessage: {
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: FontSizes.regular,
  },

  resultMessage: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.success,
  },

  resultMessageText: {
    color: Colors.successDark,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Input styles
  inputGroup: {
    marginBottom: Spacing.md,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.medium,
    padding: 12,
    fontSize: FontSizes.medium,
    color: Colors.text,
  },

  textArea: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.medium,
    padding: 12,
    fontSize: FontSizes.medium,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Button styles
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  primaryButtonDisabled: {
    backgroundColor: '#a0c4e8',
  },

  buttonText: {
    color: '#fff',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },

  buttonWithIcon: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  purpleButton: {
    backgroundColor: Colors.purple,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },

  // Link styles
  link: {
    color: Colors.link,
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  normalText: {
    color: Colors.textLight,
    fontSize: FontSizes.regular,
  },

  backLink: {
    color: Colors.link,
    textAlign: 'center',
    fontSize: FontSizes.regular,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userName: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.text,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.sm,
    backgroundColor: '#ffe8e8',
    borderRadius: 25,
  },

  logoutText: {
    color: Colors.error,
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },

  // Utility styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullWidth: {
    width: '100%',
  },

  bold: {
    fontWeight: 'bold',
  },
});

export default commonStyles;