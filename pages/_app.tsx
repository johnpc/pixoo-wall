import "@fontsource/inter";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}
