import { useEffect, useState } from "react";
import {
  Bookmark,
  MoreHorizontal,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { fetchExploreStudents } from "../api/students.js";

export default function ExploreStudents() {
  // --- UI state ---
  const [sortOption, setSortOption] = useState("Most recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Data-loading state ---
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [attempt, setAttempt] = useState(0); // bump this to retry

  // Fetch students (re-runs whenever `attempt` changes)
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await fetchExploreStudents({
          signal: controller.signal,
          attempt,
        });
        setStudents(data);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  function handleRetry() {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

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

  // Interaction 2: Sorting is DERIVED from students + sortOption.
  // We no longer store a re-sorted copy in state, so sorting stays correct
  // even after bookmarks change or data reloads.
  const sortedStudents = [...students].sort((a, b) => {
    if (sortOption === "Name (A-Z)") return a.name.localeCompare(b.name);
    if (sortOption === "Saved first") {
      return b.bookmarked === a.bookmarked ? 0 : b.bookmarked ? 1 : -1;
    }
    return new Date(b.dateAdded) - new Date(a.dateAdded); // "Most recent"
  });

  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  // Decide what to show. Order matters.
  let content;
  if (status === "loading") {
    content = <Message role="status">Loading students…</Message>;
  } else if (status === "error") {
    content = (
      <Message role="alert" title="Couldn't load students.">
        Check your connection and try again.
        <br />
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 px-4 py-2 rounded-xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50"
        >
          Try again
        </button>
      </Message>
    );
  } else if (students.length === 0) {
    content = (
      <Message title="No students have joined yet.">Check back soon.</Message>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStudents.map((student) => (
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
    );
  }

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

        {content}
      </div>
    </section>
  );
}

// Small helper for loading / error / empty messages (same file, not exported)
function Message({ title, children, role }) {
  return (
    <div role={role} className="text-center py-16 text-gray-500">
      {title && <p className="text-lg font-semibold">{title}</p>}
      <p className="text-sm mt-2">{children}</p>
    </div>
  );
}
