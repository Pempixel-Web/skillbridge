import React, { useState } from "react";
import {
  Bookmark,
  MoreHorizontal,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function ExploreStudents() {
  const [sortOption, setSortOption] = useState("Most recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initial student data state with bookmark status tracking
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ezekiel Vincent",
      role: "Frontend Developer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      skills: ["React", "Javascript", "CSS"],
      bio: "I build responsive and user-friendly web applications. Passionate about clean code and great UI/UX",
      bookmarked: false,
      dateAdded: "2026-10-16",
    },
    {
      id: 2,
      name: "Tomiwa Ola",
      role: "UI/UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      skills: ["Figma", "UI Design", "Prototyping"],
      bio: "Crafting intuitive user interfaces and delightful digital experiences with user-centric workflows.",
      bookmarked: true,
      dateAdded: "2026-10-14",
    },
    {
      id: 3,
      name: "Joshua Tomisi",
      role: "Full Stack Engineer",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      skills: ["Node.js", "React", "TypeScript"],
      bio: "Specialized in scalable backend systems and robust web application architectures.",
      bookmarked: false,
      dateAdded: "2026-10-15",
    },
    {
      id: 4,
      name: "Amina Bello",
      role: "Mobile App Developer",
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
      skills: ["Flutter", "React Native", "Swift"],
      bio: "Building high-performance cross-platform mobile applications for modern startups.",
      bookmarked: false,
      dateAdded: "2026-10-12",
    },
    {
      id: 5,
      name: "Ahmed Aminat",
      role: "Data Scientist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      skills: ["Python", "Machine Learning", "SQL"],
      bio: "Turning complex datasets into actionable insights and intelligent predictive models.",
      bookmarked: false,
      dateAdded: "2026-10-13",
    },
    {
      id: 6,
      name: "Yemisi Oluwapelumi",
      role: "Content Strategist",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      skills: ["Copywriting", "SEO", "Marketing"],
      bio: "Crafting compelling brand narratives and data-driven content marketing campaigns.",
      bookmarked: false,
      dateAdded: "2026-10-10",
    },
  ]);

  // Interaction 1: Toggle Bookmark Status for a specific student card
  const handleToggleBookmark = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id
          ? { ...student, bookmarked: !student.bookmarked }
          : student,
      ),
    );
  };

  // Interaction 2: Sort student cards dynamically based on dropdown selection
  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);

    let sorted = [...students];
    if (option === "Most recent") {
      sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (option === "Name (A-Z)") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "Saved first") {
      sorted.sort((a, b) =>
        b.bookmarked === a.bookmarked ? 0 : b.bookmarked ? 1 : -1,
      );
    }
    setStudents(sorted);
  };

  return (
    <section className="w-full bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Students
          </h2>

          {/* Sort / Filter Dropdown Interaction */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-44 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none transition-all"
            >
              <span>{sortOption}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20">
                {["Most recent", "Name (A-Z)", "Saved first"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortSelection(option)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortOption === option
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Card Top Actions: Options Menu & Bookmark */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {student.name}
                      </h3>
                      <p className="text-xs font-medium text-blue-600">
                        {student.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Interaction 1: Bookmark Toggle Button */}
                    <button
                      onClick={() => handleToggleBookmark(student.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        student.bookmarked
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      aria-label="Bookmark profile"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${student.bookmarked ? "fill-blue-600" : ""}`}
                      />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {student.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50/70 text-blue-600 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bio / Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {student.bio}
                </p>
              </div>

              {/* Card Footer Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group-hover:border-blue-300"
                >
                  <span>View profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
