import { Link, NavLink } from 'react-router-dom';
import css from './Navigation.module.css';

const Navigation = () => {
  return (
    <header className="site-header">
    <div className={css.wrapper}>
      <nav className={css.mainNav}>
        <Link 
          to="/" 
          className={css.navLink}
        >
          <p className={css.logo}>Chess<span className={css.logoSpan}>B</span></p>
        </Link>
        <ul className={css.list}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? `${css.link} ${css.active}` : css.link
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sandbox" 
              className={({ isActive }) => 
                isActive ? `${css.link} ${css.active}` : css.link
              }
            >
              SandBox
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
    </header>
  );
};

export default Navigation;