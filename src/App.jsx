import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterBusiness from "./pages/RegisterBusiness";
import BusinessInfo from "./pages/BusinessInfo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-business" element={<RegisterBusiness />} />
      <Route path="/business/:id" element={<BusinessInfo />} />
    </Routes>
  );
}

export default App;
