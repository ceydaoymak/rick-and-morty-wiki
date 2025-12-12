import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { CharactersList, CharacterDetail } from '@/pages/characters';
import { EpisodesList, EpisodeDetail } from '@/pages/episodes';
import { LocationsList, LocationDetail } from '@/pages/locations';

export default function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharactersList />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/episodes" element={<EpisodesList />} />
            <Route path="/episodes/:id" element={<EpisodeDetail />} />
            <Route path="/locations" element={<LocationsList />} />
            <Route path="/locations/:id" element={<LocationDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
