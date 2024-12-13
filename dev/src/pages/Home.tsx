import './home.css';
import { Link } from 'react-router';

const Home: React.FC = () => {
  return (
    <div className="scene">
      <div className="spot spot-1" />
      <div className="spot spot-2" />
      <div className="frame">
        <div>
          <Link to="/book">Book</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
