const SnapPreview = ({ snapZone, taskbarHeight = 48 }) => {
  if (!snapZone) return null;

  const getPreviewStyle = () => {
    const base = {
      position: 'fixed',
      background: 'rgba(96, 205, 255, 0.12)',
      border: '2px solid rgba(96, 205, 255, 0.35)',
      borderRadius: '8px',
      transition: 'all 200ms cubic-bezier(0.1, 0.9, 0.2, 1)',
      zIndex: 9998,
      margin: '4px',
    };

    switch (snapZone) {
      case 'maximize':
        return { ...base, top: 0, left: 0, right: 0, bottom: `${taskbarHeight}px` };
      case 'left-half':
        return { ...base, top: 0, left: 0, width: '50%', bottom: `${taskbarHeight}px` };
      case 'right-half':
        return { ...base, top: 0, right: 0, width: '50%', bottom: `${taskbarHeight}px` };
      default:
        return base;
    }
  };

  return <div style={getPreviewStyle()} />;
};

export default SnapPreview;
