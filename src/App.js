import logo from "./logo.svg";
import "./App.css";
import Vespers from "./Vespers";
import Main from "./Main";
import Footer from "./Footer";
import "./styles.css";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NinthHour from "./NinthHour";

function App() {
  return (
    <>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nieszpory" element={<Vespers />} />
          <Route path="/nona" element={<NinthHour />} />
        </Routes>
      </Main>
      <Footer />
    </>
  );
}

export default App;
