import React, { useState, useEffect } from 'react';
import characters from '../Lespersonnage/characters.json'; // Assurez-vous que le chemin est correct pour accéder à votre fichier JSON


function PersonnageLocal() {
  const [characters, setcharacters] = useState(null);

  useEffect(() => {
    // Accéder au personnage avec l'ID 1
    const chars = characters.find(p => p.id === 1);
    setPersonnage(chars);
  }, []);

  if (!characters) return <div>Aucun personnage trouvé</div>;

  return (
    <div >
      <h1>{characters.name}</h1>
      <p>Niveau: {characters.realName}</p>
      <p>Classe: {characters.universe}</p>
    </div>
  );
}

export default PersonnageLocal;