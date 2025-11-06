import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
// import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <CustomCursor />
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div id="home" className="scroll-mt-24">
                  <Hero />
                </div>
                <div id="about" className="scroll-mt-24">
                  <About />
                </div>
                <div id="skills" className="scroll-mt-24">
                  <Skills />
                </div>
                <div id="projects" className="scroll-mt-24">
                  <Projects />
                </div>
                <div id="experience" className="scroll-mt-24">
                  <Experience />
                </div>
                <div id="blog" className="scroll-mt-24">
                  <Blog />
                </div>
                <div id="contact" className="scroll-mt-24">
                  <Contact />
                </div>
                <Footer />
              </>
            }
          />

          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;