import "./app.scss";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";
import { NotFound } from "./components/not-found/not-found";
import { MonitorPage } from "./pages/monitor/monitor";
import { ThemeProvider } from "./theme-provider/theme.provider";
import { StoreProvider } from "./store-provider/store-provider";
import { Content } from "./components/content/content";

export function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <Content>
          <Header />
          <LocationProvider>
            <ErrorBoundary
              onError={() => {
                // XXX Navigate to an erorr page + create the error page
              }}
            >
              <div class="route-content">
                <Router>
                  <Route path="/monitor" component={MonitorPage} />
                  <Route component={NotFound} default />
                </Router>
              </div>
            </ErrorBoundary>
          </LocationProvider>
          <Footer />
        </Content>
      </ThemeProvider>
    </StoreProvider>
  );
}
