// import "./Hero.css";
// import { useState } from "react";

// const skills = [
//   "All skills",
//   "Development",
//   "Design",
//   "Writing",
//   "Photography",
//   "Video Editing",
// ];

// export default function Hero() {
//   const [activeSkill, setActiveSkill] = useState("All skills");
//   const [search, setSearch] = useState("");

//   return (
//     <section className="hero">
//       <div className="hero-inner">
//         <div className="hero-content">
//           <span className="hero-badge">
//             <span className="badge-dot" />
//             STUDENT TALENT DIRECTORY
//           </span>

//           <h1>
//             Discover talented
//             <span> students around you.</span>
//           </h1>

//           <p className="hero-description">
//             Find skills, explore student profiles, and discover your next
//             collaborator.
//           </p>

//           <form
//             className="hero-search"
//             onSubmit={(e) => {
//               e.preventDefault();
//               // Connect this to your existing search logic.
//               console.log("Search:", search);
//             }}
//           >
//             <div className="search-input-wrap">
//               <svg
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//                 className="search-icon"
//               >
//                 <circle cx="11" cy="11" r="7" />
//                 <path d="m16 16 4 4" />
//               </svg>

//               <input
//                 type="search"
//                 placeholder="Search by name, skill, or interest..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <button type="submit" className="search-button">
//               Search <span aria-hidden="true">→</span>
//             </button>
//           </form>

//           <div className="popular-skills" aria-label="Filter by skill">
//             {skills.map((skill) => (
//               <button
//                 key={skill}
//                 type="button"
//                 className={`skill-chip ${
//                   activeSkill === skill ? "active" : ""
//                 }`}
//                 onClick={() => setActiveSkill(skill)}
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="hero-visual">
//           <img
//             src="https://res.cloudinary.com/rclvnovx/image/upload/v1792151342/Real_Skills_Real_People_Bigger_Ideas.png"
//             alt="Students showcasing their skills and connecting with other students"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }


import "./Hero.css";

const skills = [
  "All skills",
  "Development",
  "Design",
  "Writing",
  "Photography",
  "Video Editing",
];

export default function Hero({ search = "", setSearch = () => {}, activeSkill = "All skills", setActiveSkill = () => {} }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="badge-dot" />
            STUDENT TALENT DIRECTORY
          </span>

          <h1>
            Discover talented
            <span> students around you.</span>
          </h1>

          <p className="hero-description">
            Find skills, explore student profiles, and discover your next
            collaborator.
          </p>

          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="search-input-wrap">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="search-icon"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="search"
                placeholder="Search by name, skill, or interest..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button type="submit" className="search-button">
              Search <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="popular-skills" aria-label="Filter by skill">
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                className={`skill-chip ${
                  activeSkill === skill ? "active" : ""
                }`}
                onClick={() => setActiveSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://res.cloudinary.com/rclvnovx/image/upload/v1792151342/Real_Skills_Real_People_Bigger_Ideas.png"
            alt="Students showcasing their skills and connecting with other students"
          />
        </div>
      </div>
    </section>
  );
}