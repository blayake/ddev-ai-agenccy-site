import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blayake from "@/pages/Blayake";
import "@/App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blayake />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
