import "../styles/globals.css";
import AuthState from "../context/auth/authState";
import AppState from "../context/app/appState";

function MyApp({ Component, pageProps }) {
  return (
    <AppState>
      <AuthState>
        <Component {...pageProps} />
      </AuthState>
    </AppState>
  );
}

export default MyApp;
