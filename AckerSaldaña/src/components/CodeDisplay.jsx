import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CodeDisplay = () => {
  const [typedCode, setTypedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  
  const codeLines = [
    'const student = {',
    '  name: "Acker Saldaña",',
    '  university: "Tecnológico de Monterrey",',
    '  exchange: "University of Hull",',
    '  pursuing: "MSc Advanced Computer Science",',
    '  languages: ["JavaScript", "C++", "Python", "Swift"],',
    '  stack: ["React", "Three.js", "PostgreSQL", "MySQL"],',
    '  passion: "Building bridges between tech & human needs",',
    '  motto: "Continuous learning, inclusive innovation"',
    '};'
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';

    const typeInterval = setInterval(() => {
      if (lineIndex < codeLines.length) {
        if (charIndex < codeLines[lineIndex].length) {
          currentText += codeLines[lineIndex][charIndex];
          setTypedCode(currentText);
          charIndex++;
        } else {
          currentText += '\n';
          lineIndex++;
          charIndex = 0;
          setCurrentLine(lineIndex);
        }
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTypedCode('');
          setCurrentLine(0);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [typedCode === '']);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a1a] rounded-lg p-6 font-['JetBrains_Mono'] text-base border border-[#2a2a2a]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        <div className="relative h-[320px] overflow-hidden">
          <pre className="text-gray-300 whitespace-pre-wrap">
            <code>{typedCode}</code>
          </pre>
          <motion.span
            className="inline-block w-2 h-4 bg-[#4a9eff] ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CodeDisplay;