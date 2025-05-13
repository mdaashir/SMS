import { Suspense as ReactSuspense } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const Suspense = ({ children, fallback }) => {
  return (
    <ReactSuspense
      fallback={
        fallback || (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner size="lg" />
          </div>
        )
      }
    >
      {children}
    </ReactSuspense>
  );
};

Suspense.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default Suspense; 