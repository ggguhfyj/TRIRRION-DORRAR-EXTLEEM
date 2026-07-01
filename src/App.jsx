import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ArticleGrid from './components/ArticleGrid.jsx';
import Footer from './components/Footer.jsx';
import AnnoyingPopup from './components/AnnoyingPopup.jsx';

function App() {
  return (
    <div className="site-shell">
      <Header />
      <div className="content-frame">
        <div className="content-body">
          <main>
            <Hero />
            <ArticleGrid />
          </main>
        </div>
        <Footer />
      </div>
      <AnnoyingPopup />
    </div>
  );
}

export default App;
