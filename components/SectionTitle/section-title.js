import s from "./section-title.module.scss";

const SectionTitle = ({ title }) => (
  <div className={s.SectionTitle}>
    <h1>{title}</h1>
  </div>
);
export default SectionTitle;
