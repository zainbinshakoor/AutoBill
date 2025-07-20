import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps & TouchableOpacityProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    let buttonStyle: ViewStyle[] = [styles.button, styles[size]];

    switch (variant) {
      case 'primary':
        buttonStyle.push(styles.primary);
        break;
      case 'secondary':
        buttonStyle.push(styles.secondary);
        break;
      case 'outline':
        buttonStyle.push(styles.outline);
        break;
      case 'danger':
        buttonStyle.push(styles.danger);
        break;
      default:
        buttonStyle.push(styles.primary);
    }

    if (disabled || loading) {
      buttonStyle.push(styles.disabled);
    }

    if (style) {
      buttonStyle.push(style);
    }

    return buttonStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    let textStyleArray: TextStyle[] = [styles.text, styles[`${size}Text` as keyof typeof styles]];

    switch (variant) {
      case 'primary':
        textStyleArray.push(styles.primaryText);
        break;
      case 'secondary':
        textStyleArray.push(styles.secondaryText);
        break;
      case 'outline':
        textStyleArray.push(styles.outlineText);
        break;
      case 'danger':
        textStyleArray.push(styles.dangerText);
        break;
      default:
        textStyleArray.push(styles.primaryText);
    }

    if (disabled || loading) {
      textStyleArray.push(styles.disabledText);
    }

    if (textStyle) {
      textStyleArray.push(textStyle);
    }

    return textStyleArray;
  };

  const getLoadingColor = (): string => {
    if (variant === 'primary' || variant === 'danger') {
      return COLORS.white;
    }
    return COLORS.primary;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getLoadingColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: SPACING.xs,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconContainer: {
    marginRight: SPACING.sm,
  } as ViewStyle,
  text: {
    fontWeight: '600',
    textAlign: 'center',
  } as TextStyle,

  // Sizes
  small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  } as ViewStyle,
  medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,

  // Text sizes
  smallText: {
    fontSize: FONTS.small,
  } as TextStyle,
  mediumText: {
    fontSize: FONTS.medium,
  } as TextStyle,
  largeText: {
    fontSize: FONTS.large,
  } as TextStyle,

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  secondary: {
    backgroundColor: COLORS.secondary,
  } as ViewStyle,
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  } as ViewStyle,
  danger: {
    backgroundColor: COLORS.error,
  } as ViewStyle,

  // Text colors
  primaryText: {
    color: COLORS.white,
  } as TextStyle,
  secondaryText: {
    color: COLORS.white,
  } as TextStyle,
  outlineText: {
    color: COLORS.primary,
  } as TextStyle,
  dangerText: {
    color: COLORS.white,
  } as TextStyle,

  // States
  disabled: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  } as ViewStyle,
  disabledText: {
    color: COLORS.gray,
  } as TextStyle,
});

export default Button;