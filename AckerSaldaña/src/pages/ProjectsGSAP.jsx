import { useEffect } from 'react';
import DesktopOS from '../components/DesktopOS';
import TargetCursor from '../components/TargetCursor';
import { useTransition } from '../context/TransitionContext';

const ProjectsGSAP = () => {
  const { resetTransition } = useTransition();

  useEffect(() => {
    // Force scroll to top
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Cleanup transition state when leaving
    return () => {
      resetTransition();
    };
  }, [resetTransition]);

  return (
    <div className="min-h-screen relative bg-black">
      <TargetCursor />
      <DesktopOS />
    </div>
  );
};

export default ProjectsGSAP;
