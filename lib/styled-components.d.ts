// styled-components.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof import('./theme').theme.colors;
  }
}
