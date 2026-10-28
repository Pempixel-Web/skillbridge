// import "./Hero.css";
// export default function SearchBar({ value, onChange }) {
//   return (
//     <form
//       className="hero-search"
//       onSubmit={(e) => {
//         e.preventDefault();
//       }}
//     >
//       <div className="search-input-wrap">
//         <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
//           <circle cx="11" cy="11" r="7" />
//           <path d="m16 16 4 4" />
//         </svg>

//         <input
//           type="search"
//           placeholder="Search by name, skill, or interest..."
//           value={value}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <button type="submit" className="search-button">
//         Search <span aria-hidden="true">→</span>
//       </button>
//     </form>
//   );
// }

import "./Hero.css";

export default function SearchBar({ value, onChange }) {
  return (
    <form className="hero-search" onSubmit={(e) => e.preventDefault()}>
      <div className="search-input-wrap">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          aria-label="Search students by name, skill, or interest"
          placeholder="Search by name, skill, or interest..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button type="submit" className="search-button">
        Search <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
