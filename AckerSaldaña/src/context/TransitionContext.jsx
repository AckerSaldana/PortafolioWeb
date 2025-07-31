import { createContext, useContext, useState } from 'react';

const TransitionContext = createContext();

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
};

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [terminalConfig, setTerminalConfig] = useState(null);
  const [preserveTerminal, setPreserveTerminal] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
    setTransitionComplete(false);
    setPreserveTerminal(true);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
    setTransitionComplete(true);
  };

  const resetTransition = () => {
    setIsTransitioning(false);
    setTransitionComplete(false);
    setPreserveTerminal(false);
    setTerminalConfig(null);
  };

  return (
    <TransitionContext.Provider value={{
      isTransitioning,
      transitionComplete,
      terminalConfig,
      preserveTerminal,
      startTransition,
      completeTransition,
      resetTransition,
      setTerminalConfig,
      setPreserveTerminal
    }}>
      {children}
    </TransitionContext.Provider>
  );
};