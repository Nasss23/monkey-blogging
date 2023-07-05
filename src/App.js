import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import SignUpPages from "./pages/SignUpPages";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/sign-up" element={<SignUpPages></SignUpPages>}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
