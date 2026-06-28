/**
 * SkillBar — pure presentational component.
 *
 * Props:
 *   label      {string}  skill name, e.g. "React"
 *   percent    {number}  proficiency value 0–100
 *   isVisible  {boolean} when true the fill animates to `percent`%
 */
const SkillBar = ({ label, percent, isVisible }) => (
  <div className="skill-bar-item">
    <div className="skill-bar-header">
      <span className="skill-label">{label}</span>
      <span className="skill-percent">{percent}%</span>
    </div>
    <div className="skill-track">
      <div
        className="skill-fill"
        style={{ width: isVisible ? `${percent}%` : '0%' }}
        role="progressbar"
        aria-valuenow={isVisible ? percent : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} proficiency`}
      />
    </div>
  </div>
);

export default SkillBar;
