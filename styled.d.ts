import 'styled-components';
import { theme } from './lib/styles';

type ThemeType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
