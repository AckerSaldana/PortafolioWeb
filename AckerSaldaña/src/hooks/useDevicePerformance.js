import { useState, useEffect } from 'react';

const useDevicePerformance = () => {
  const [performance, setPerformance] = useState('high');
  const [fps, setFps] = useState(60);

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setPerformance('low');
        return;
      }

      // Check device memory (if available)
      const memory = navigator.deviceMemory || 4;
      
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      
      // Check connection type
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || '4g';
      
      // Check if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Determine performance level
      if (memory < 4 || cores < 4 || connectionType === '2g' || connectionType === '3g') {
        setPerformance('low');
      } else if (isMobile || memory < 8) {
        setPerformance('medium');
      } else {
        setPerformance('high');
      }

      // Cleanup
      canvas.remove();
    };

    checkPerformance();

    // Monitor FPS - check if performance API is available
    let animationId;
    
    if (typeof window !== 'undefined' && window.performance && window.performance.now) {
      let frameCount = 0;
      let lastTime = window.performance.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = window.performance.now();
        
        if (currentTime >= lastTime + 1000) {
          setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
          frameCount = 0;
          lastTime = currentTime;
          
          // Auto-adjust quality based on FPS
          if (fps < 20 && performance !== 'low') {
            setPerformance('low');
          } else if (fps < 40 && performance === 'high') {
            setPerformance('medium');
          }
        }
        
        animationId = requestAnimationFrame(measureFPS);
      };

      measureFPS();
    } else {
      // Fallback for browsers without performance.now
      // Use Date.now() as a fallback
      let frameCount = 0;
      let lastTime = Date.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = Date.now();
        
        if (currentTime >= lastTime + 1000) {
          setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
          frameCount = 0;
          lastTime = currentTime;
          
          // Auto-adjust quality based on FPS
          if (fps < 20 && performance !== 'low') {
            setPerformance('low');
          } else if (fps < 40 && performance === 'high') {
            setPerformance('medium');
          }
        }
        
        animationId = requestAnimationFrame(measureFPS);
      };

      measureFPS();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [fps]);

  return { performance, fps };
};

export default useDevicePerformance;