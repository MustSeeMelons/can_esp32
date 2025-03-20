import "./app.scss";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";
import { NotFound } from "./components/not-found/not-found";
import { MonitorPage } from "./pages/monitor/monitor";
import { ThemeProvider } from "./components/theme-provider/theme.provider";
import { useEffect } from "preact/hooks";

export function App() {
  useEffect(() => {
    const url = `ws://${window.location.host}/ws`;
    const socket = new WebSocket(url);

    socket.onopen = () => {
      socket.send("Hello Server!");
    };

    socket.onmessage = (event) => {
      console.log("Message from server ", event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  }, []);

  return (
    <ThemeProvider>
      <div class="app">
        <Header />
        <div class="content">
          <LocationProvider>
            <ErrorBoundary
              onError={() => {
                // XXX Navigate to an erorr page + create the error page
              }}
            >
              <Router>
                <Route path="/monitor" component={MonitorPage} />
                <Route component={NotFound} default />
              </Router>
            </ErrorBoundary>
          </LocationProvider>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
