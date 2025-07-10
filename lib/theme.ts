import { createGlobalStyle } from 'styled-components';

export const theme = {

    colors: {
        primary: "#123456",
        gray: {
            300: "#ccc",
            400: "#bbb"
        },
        gradient: {
            primary: "#abc",
            secondary: "#def"
        },
        // etc...
    }
};

export const GlobalStyles = createGlobalStyle`
  // paste your full GlobalStyles string template here (already provided above)
`;
