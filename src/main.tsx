import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App.tsx";
import "./index.css";
import AppStateProvider from "@/providers/AppStateProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider
			defaultTheme="dark"
			storageKey="vite-ui-theme">
			<AppStateProvider>
				<App />
			</AppStateProvider>
		</ThemeProvider>
	</StrictMode>
);
