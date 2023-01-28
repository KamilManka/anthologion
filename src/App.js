import logo from "./logo.svg";
import "./App.css";
import Vespers from "./Vespers";
import Main from "./Main";
import Footer from "./Footer";
import "./styles.css";

function App() {
  return (
    <div>
      <Main>
        <Vespers />
      </Main>
      <Footer />
    </div>
  );
}

export default App;
