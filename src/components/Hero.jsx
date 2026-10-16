// import "./Hero.css";
// function Hero() {
//   return (
//     <>
//       <section className="hero">
//         {/* First section */}
//         <section className="first-section">
//           {/* CTA in hero section - left*/}
//           <section>
//             <button className="pill-badge">
//               <span className="badge-dot"></span>
//               STUDENT TALENT DIRECTORY
//             </button>
//             <h1>
//               Discover talented <br />
//               <span>students around you.</span>
//             </h1>
//             <p>
//               Find skills, explore student profiles, and discover your next
//               collaborator.
//             </p>
//           </section>

//           {/* Image section - right*/}
//           <section>
//             <img
//               src="https://res.cloudinary.com/rclvnovx/image/upload/v1792151342/Real_Skills_Real_People_Bigger_Ideas.png"
//               alt="A student smilling"
//             />
//           </section>
//         </section>

//         {/* Second Section */}
//         <section className="second-section">
//           {/* Input search section */}
//           <div className="input-div">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="1em"
//               height="1em"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 fill="none"
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeWidth={2}
//                 d="m21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0a8.5 8.5 0 0 1 17 0Z"
//               ></path>
//             </svg>

//             <input
//               className="search-input"
//               type="text"
//               placeholder="Seach by name, skill or interest"
//             />
//             <button>
//               Search{" "}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="1em"
//                 height="1em"
//                 viewBox="0 0 1024 1024"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4"
//                 ></path>
//               </svg>
//             </button>
//           </div>

//           {/* Filter button group */}
//           <p>Popular Skills</p>
//           <div className="btn-group">
//             <button>All skills</button>
//             <button>Development</button>
//             <button>Design</button>
//             <button>Writing</button>
//             <button>Photography</button>
//             <button>Video Editing</button>
//           </div>
//         </section>
//       </section>
//     </>
//   );
// }

// export default Hero;

import "./Hero.css";
import { useState } from "react";

const skills = [
  "All skills",
  "Development",
  "Design",
  "Writing",
  "Photography",
  "Video Editing",
];

export default function Hero() {
  const [activeSkill, setActiveSkill] = useState("All skills");
  const [search, setSearch] = useState("");

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
              // Connect this to your existing search logic.
              console.log("Search:", search);
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
