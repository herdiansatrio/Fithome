import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import Programs from './pages/Programs';
import WorkoutSession from './pages/WorkoutSession';
import Calculator from './pages/Calculator';
import Nutrition from './pages/Nutrition';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="latihan" element={<Exercises />} />
          <Route path="latihan/:slug" element={<ExerciseDetail />} />
          <Route path="program" element={<Programs />} />
          <Route path="program/:slug" element={<WorkoutSession />} />
          <Route path="kalkulator" element={<Calculator />} />
          <Route path="nutrisi" element={<Nutrition />} />
          <Route path="login" element={<Login />} />
          <Route path="profil" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
