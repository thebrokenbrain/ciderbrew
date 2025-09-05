import { render, screen } from '@testing-library/react';
import Loader from '../Loader';
import SkeletonLoader from '../SkeletonLoader';

describe('Loading Components', () => {
  describe('Loader', () => {
    it('should render with default props', () => {
      render(<Loader />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      render(<Loader message="Buscando aplicaciones..." />);
      
      expect(screen.getByText('Buscando aplicaciones...')).toBeInTheDocument();
    });

    it('should render different sizes', () => {
      const { rerender } = render(<Loader size="sm" />);
      expect(document.querySelector('.w-4')).toBeInTheDocument();
      
      rerender(<Loader size="lg" />);
      expect(document.querySelector('.w-8')).toBeInTheDocument();
    });

    it('should render without message when not provided', () => {
      render(<Loader message="" />);
      
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });
  });

  describe('SkeletonLoader', () => {
    it('should render default number of skeleton cards', () => {
      render(<SkeletonLoader />);
      
      // Should render 8 skeleton cards by default
      const skeletonCards = document.querySelectorAll('.animate-pulse');
      expect(skeletonCards).toHaveLength(8);
    });

    it('should render custom number of skeleton cards', () => {
      render(<SkeletonLoader count={4} />);
      
      const skeletonCards = document.querySelectorAll('.animate-pulse');
      expect(skeletonCards).toHaveLength(4);
    });

    it('should render skeleton cards with proper structure', () => {
      render(<SkeletonLoader count={1} />);
      
      // Check for skeleton elements
      expect(document.querySelector('.bg-gray-200')).toBeInTheDocument();
      expect(document.querySelector('.rounded-xl')).toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<SkeletonLoader className="custom-class" />);
      
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
