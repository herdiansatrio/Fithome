import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import Programs from './pages/Programs';
import WorkoutSession from './pages/WorkoutSession';
import Calculator from './pages/Calculator';
import Nutrition from './pages/Nutrition';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* ── Public routes ── */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="daftar" element={<Register />} />

            {/* ── Protected routes (harus login) ── */}
            <Route
              path="latihan"
              element={
                <ProtectedRoute>
                  <Exercises />
                </ProtectedRoute>
              }
            />
            <Route
              path="latihan/:slug"
              element={
                <ProtectedRoute>
                  <ExerciseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="program"
              element={
                <ProtectedRoute>
                  <Programs />
                </ProtectedRoute>
              }
            />
            <Route
              path="program/:slug"
              element={
                <ProtectedRoute>
                  <WorkoutSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="kalkulator"
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="nutrisi"
              element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="profil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
