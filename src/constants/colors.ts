/**
 * App color constants from Tailwind config
 * Import these for use in React Native style props (ActivityIndicator, icons, etc.)
 * Use className for component styling whenever possible
 */
import colors from "tailwindcss/colors";

export const appColors = {
  primary: colors.violet[600], // #8b5cf6
  primaryLight: colors.violet[500],
  primaryDark: colors.violet[700],
  
  // Neutral grays
  gray: {
    50: colors.gray[50],
    100: colors.gray[100],
    200: colors.gray[200],
    300: colors.gray[300],
    400: colors.gray[400],
    500: colors.gray[500],
    600: colors.gray[600],
    700: colors.gray[700],
    800: colors.gray[800],
    900: colors.gray[900],
    950: colors.zinc[950],
  },
  
  // Zinc (darker neutrals for dark mode)
  zinc: {
    700: colors.zinc[700],
    800: colors.zinc[800],
    900: colors.zinc[900],
    950: colors.zinc[950],
  },
  
  // Basic colors
  white: colors.white,
  black: colors.black,
} as const;