import { BrowserRouter } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, End } from './components';

const App = () => {
  return (
    <BrowserRouter>
      {/* Single full-page star field behind everything */}
      <div className="fixed inset-0 z-0" style={{ background: '#000' }}>
        <StarsCanvas />
      </div>

      <div className="relative z-10" style={{ background: 'transparent' }}>
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <End />
      </div>
    </BrowserRouter>
  );
}

export default App;