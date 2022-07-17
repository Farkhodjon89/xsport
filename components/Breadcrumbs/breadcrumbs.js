import s from './breadcrumbs.module.scss';
import Link from 'next/link';

const Breadcrumbs = ({ path }) => (
  <div className={s.links}>
    {path.map((v, key) => (
      <Link href={v.link} key={v.name}>
        <a>{`${v.name} ${key + 1 != path.length ? ' > ' : ''}`}</a>
      </Link>
    ))}
  </div>
);
export default Breadcrumbs;
