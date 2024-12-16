const motionConfig = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: {
    default: { type: 'spring', duration: 1 },
    opacity: { ease: 'linear' },
  },
};

export default motionConfig;
