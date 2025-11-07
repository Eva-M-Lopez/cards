
export const Colors = {
  // Primary brand colors
  primary: '#6a11cb',
  secondary: '#2575fc',
  
  // Background colors
  background: '#f0f0f0',
  backgroundLight: '#f8f9fa',
  cardBackground: '#ffffff',
  
  // Text colors
  text: '#333',
  textLight: '#666',
  textMuted: '#888',
  
  // Status colors
  error: '#dc3545',
  errorDark: '#c82333',
  success: '#4CAF50',
  successDark: '#45a049',
  successLight: '#f0f8f0',
  
  // Accent colors
  purple: '#9c27b0',
  purpleDark: '#673ab7',
  link: '#2b00ff',
  
  // UI element colors
  border: '#e0e0e0',
  inputBorder: '#e0e0e0',
  shadowColor: '#000',
  
  // Overlay colors
  overlay: 'rgba(255, 255, 255, 0.95)',
};

export const Gradients = {
  primary: ['#6a11cb', '#2575fc'],
  success: ['#4CAF50', '#45a049'],
  purple: ['#9c27b0', '#673ab7'],
  error: ['#dc3545', '#c82333'],
};

export const Spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
};

export const FontSizes = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 28,
};

export const BorderRadius = {
  small: 5,
  medium: 10,
  large: 12,
  xlarge: 20,
  round: 50,
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const Typography = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
  },
  semibold: {
    fontFamily: 'System',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold' as const,
  },
};

// Common component styles
export const CommonStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xlarge,
    padding: Spacing.xxl,
    ...Shadows.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    fontSize: FontSizes.medium,
    color: Colors.text,
  },
  button: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontSize: FontSizes.medium,
    fontWeight: '600' as const,
  },
};

export default {
  Colors,
  Gradients,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
  Typography,
  CommonStyles,
};