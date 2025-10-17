import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Сторінку не знайдено</h2>
        <p className={styles.text}>
          На жаль, сторінка, яку ви шукаєте, не існує або була видалена.
        </p>
        <Link to="/" className={styles.button}>
          Повернутись на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;