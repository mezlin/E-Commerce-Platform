import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
  interface Palette {
    neutral?: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

declare module "@emotion/react" {
  export interface Theme extends import("@mui/material/styles").Theme {}
}
