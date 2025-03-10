// src/module/home/Changelog.tsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Changelog: React.FC = () => {
  const [changelog, setChangelog] = useState<string>('');

  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then((response) => response.text())
      .then((text) => setChangelog(text))
      .catch((error) =>
        console.error('Erreur lors du chargement du changelog:', error)
      );
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Changelog</h1>
      <div className="prose">
        <ReactMarkdown>{changelog}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Changelog;
