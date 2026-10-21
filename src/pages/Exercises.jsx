import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseFilters from '../components/ExerciseFilters';
import SectionHeading from '../components/SectionHeading';
import { exercises } from '../data/exercises';

export default function Exercises() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(searchParams.get('group') || 'all');
  const [difficulty, setDifficulty] = useState('all');
  const [equipment, setEquipment] = useState('all');

  // Sync URL params untuk group filter dari homepage
  useEffect(() => {
    const group = searchParams.get('group');
    if (group) setMuscleGroup(group);
  }, [searchParams]);

  const completedExercises = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('forge_completed') || '[]');
    } catch {
      return [];
    }
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchSearch =
        !search ||
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscleGroupLabel.toLowerCase().includes(search.toLowerCase()) ||
        ex.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchGroup = muscleGroup === 'all' || ex.muscleGroup === muscleGroup;
      const matchDiff = difficulty === 'all' || ex.difficulty === difficulty;
      const matchEquip = equipment === 'all' || ex.equipment === equipment;
      return matchSearch && matchGroup && matchDiff && matchEquip;
    });
  }, [search, muscleGroup, difficulty, equipment]);

  const handleReset = () => {
    setSearch('');
    setMuscleGroup('all');
    setDifficulty('all');
    setEquipment('all');
    setSearchParams({});
  };

  return (
    <div className="section">
      <div className="container-main">
        <SectionHeading
          label="Katalog Latihan"
          title={<>FIND YOUR <span className="text-accent">NEXT MOVE</span></>}
          subtitle="Temukan latihan yang tepat untuk tujuanmu. Filter berdasarkan kelompok otot, kesulitan, atau peralatan."
        />

        <ExerciseFilters
          search={search}
          onSearchChange={setSearch}
          muscleGroup={muscleGroup}
          onMuscleGroupChange={setMuscleGroup}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          equipment={equipment}
          onEquipmentChange={setEquipment}
          onReset={handleReset}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">
              Latihan tidak ditemukan
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
              Coba ubah kata kunci pencarian atau hapus beberapa filter yang aktif.
            </p>
            <button onClick={handleReset} className="btn-secondary text-sm">
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCompleted={completedExercises.includes(exercise.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
