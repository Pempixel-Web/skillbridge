// import Hero from "../components/Hero.jsx";
// function Directory() {
//   return (
//     <main>
//       <Hero />
//     </main>
//   );
// }

// export default Directory;


import { useState } from 'react';
import Hero from '../components/Hero.jsx';
import StudentCard from '../components/StudentCard.jsx';

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All skills");

  // Sample student database matching your categories and filters
  const [students] = useState([
    { 
      id: 1, 
      name: "Ezekiel Vincent", 
      role: "Frontend Developer", 
      skills: ["React", "Javascript", "CSS", "Development"], 
      bio: "I build responsive and user-friendly web applications. Passionate about clean code and great UI/UX." 
    },
    { 
      id: 2, 
      name: "Sarah Jenkins", 
      role: "UI/UX Designer", 
      skills: ["Design", "Figma", "User Research"], 
      bio: "Passionate about crafting intuitive user experiences and gorgeous interactive wireframes." 
    },
    { 
      id: 3, 
      name: "Liam O'Connor", 
      role: "Technical Writer", 
      skills: ["Writing", "Markdown", "Documentation"], 
      bio: "Translating complex codebases into crisp, clear guides and developer documentation." 
    },
    { 
      id: 4, 
      name: "Aisha Bello", 
      role: "Photographer & Creator", 
      skills: ["Photography", "Lightroom", "Portrait"], 
      bio: "Capturing authentic stories and vibrant campus moments through the lens." 
    },
    { 
      id: 5, 
      name: "Marcus Chen", 
      role: "Video Editor", 
      skills: ["Video Editing", "Premiere Pro", "After Effects"], 
      bio: "Editing engaging short-form content, tech documentaries, and cinematic projects." 
    },
    { 
      id: 6, 
      name: "Chloe Dupont", 
      role: "Full Stack Engineer", 
      skills: ["Development", "Node.js", "React"], 
      bio: "Building robust backends and bridging them seamlessly with modern frontend systems." 
    }
  ]);

  // Real-time filter logic for search input & filter pill chips
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = 
      selectedSkill === "All skills" || 
      student.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  return (
    <main className="directory-page">
      {/* Hero Section with interactive search and skill filter props */}
      <Hero 
        search={searchQuery} 
        setSearch={setSearchQuery} 
        activeSkill={selectedSkill} 
        setActiveSkill={setSelectedSkill} 
      />

      {/* Explore Students Grid Section */}
      <section className="explore-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 4.3%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0b1e43' }}>Explore Students</h2>
          <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
            Showing {filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredStudents.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <p style={{ fontSize: '18px', fontWeight: '600' }}>No students found matching your criteria.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search query or choosing a different skill filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}