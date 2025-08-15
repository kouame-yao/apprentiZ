import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import ApplicationContextProvider from "../../context/ApplicationContextProvider";
const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationContextProvider>
        <Component {...pageProps} />
      </ApplicationContextProvider>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontSize: "clamp(14px, 2.5vw, 20px)", // Responsive automatique
            padding: "clamp(12px, 2vw, 24px)", // S'adapte à l'écran
            maxWidth: "clamp(280px, 50vw, 480px)", // Largeur flexible
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            lineHeight: "1.5",
          },
        }}
      />
    </QueryClientProvider>
  );
}
