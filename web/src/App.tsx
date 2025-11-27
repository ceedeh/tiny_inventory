import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { StoreDetailPage } from "./pages/StoreDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stores/:id" element={<StoreDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
