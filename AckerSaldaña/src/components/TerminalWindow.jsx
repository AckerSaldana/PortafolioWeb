import { useState, useRef, useEffect } from 'react';

const TerminalWindow = ({ onOpenWindow }) => {
  const [output, setOutput] = useState([
    'PORTFOLIO OS v2.0',
    'Type "help" for available commands',
    ''
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newOutput = [...output, `guest@portfolio:~$ ${cmd}`];

    switch (trimmed) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  projects  - Open Project Explorer',
          '  photos    - Open Photo Gallery',
          '  gallery   - Open Photo Gallery',
          '  about     - About me',
          '  skills    - View technical skills',
          '  contact   - Contact information',
          '  clear     - Clear terminal',
          ''
        );
        break;

      case 'projects':
        newOutput.push('Opening Project Explorer...');
        onOpenWindow('projects');
        break;

      case 'photos':
      case 'gallery':
        newOutput.push('Opening Photo Gallery...');
        onOpenWindow('gallery');
        break;

      case 'about':
        newOutput.push(
          'Acker Saldaña',
          'Full Stack Developer & Photographer',
          'Passionate about creating beautiful digital experiences',
          ''
        );
        break;

      case 'skills':
        newOutput.push(
          'Technical Stack:',
          '  Frontend: React, Three.js, GSAP, Tailwind CSS',
          '  Backend: Node.js, Python, Supabase',
          '  Other: Git, Docker, WebGL',
          ''
        );
        break;

      case 'contact':
        newOutput.push(
          'Contact Information:',
          '  GitHub: github.com/AckerSaldana',
          '  Email: alcker100@hotmail.com',
          ''
        );
        break;

      case 'clear':
        setOutput(['PORTFOLIO OS v2.0', 'Type "help" for available commands', '']);
        return;

      case '':
        newOutput.push('');
        break;

      default:
        newOutput.push(`Command not found: ${trimmed}`, 'Type "help" for available commands', '');
    }

    setOutput(newOutput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div
      className="h-full p-4 overflow-y-auto text-sm text-[#e0e0e0] cursor-text"
      onClick={() => inputRef.current?.focus()}
      ref={outputRef}
    >
      {output.map((line, i) => (
        <div key={i} className={line.startsWith('guest@') ? 'text-[#0affc2]' : ''}>
          {line}
        </div>
      ))}

      <div className="flex items-center gap-2 mt-1">
        <span className="text-[#0affc2] font-bold">guest@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-white font-['JetBrains_Mono']"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default TerminalWindow;
