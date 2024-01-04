import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Room from "./Pages/Room";
import { SocketProvider } from "./context/SocketProvider";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/:roomId"
        element={
          <SocketProvider>
            <Room />
          </SocketProvider>
        }
      />
    </Routes>
  );
}

export default App;
