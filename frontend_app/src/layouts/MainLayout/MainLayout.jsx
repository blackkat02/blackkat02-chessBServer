import { Outlet } from "react-router-dom";
import Navigation from '../../components/Navigation/Navigation';
import style from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <header>
      <div className={style.container}>
        <Navigation />
        <Outlet />
      </div>
    </header>
  );
};

export default MainLayout;