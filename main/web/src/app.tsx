import "./app.scss";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";
import { NotFound } from "./components/not-found/not-found";
import { MonitorPage } from "./pages/monitor/monitor";
import { ThemeProvider } from "./components/theme-provider/theme.provider";

export function App() {
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
