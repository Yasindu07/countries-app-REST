import { BrowserRouter, Routes, Route } from "react-router-dom";
import Countries from "./components/Countries";
import OneCountry from "./components/OneCountry";
import Error from "./components/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Countries />} />
        <Route path="/:name" element={<OneCountry />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
