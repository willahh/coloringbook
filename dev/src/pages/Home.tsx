import { motion } from 'motion/react';
import { Link } from 'react-router';
import motionConfig from '../shared/shared';
import './home.css';

const Home: React.FC = () => {
  return (
    <motion.div className="scene" {...motionConfig}>
      <div className="spot spot-1" />
      <div className="spot spot-2" />
      <div className="frame">
        <div>
          <Link to="/book" viewTransition>
            Book
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
