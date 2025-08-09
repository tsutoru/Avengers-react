import React, { useState, useEffect } from 'react';
import characters from '../Lespersonnage/characters.json'; 
import React from 'react';

function PersonnageLocal() {
  const { useState, useEffect } = React;

  
  const CharacterService = {
    
    getCharacters: async () => {
     
      await new Promise(resolve => setTimeout(resolve, 500));


      const savedData = localStorage.getItem('charactersData');
      if (savedData) {
        return JSON.parse(savedData);
      }

      // Initial data
      return [
        { id: 1, name: "Aragorn", race: "Human", class: "Ranger", level: 10 },
        { id: 2, name: "Gandalf", race: "Maia", class: "Wizard", level: 20 },
        { id: 3, name: "Legolas", race: "Elf", class: "Archer", level: 15 },
        { id: 4, name: "Gimli", race: "Dwarf", class: "Warrior", level: 12 },
        { id: 5, name: "Frodo", race: "Hobbit", class: "Ring Bearer", level: 5 }
      ];
    },

    updateCharacter: async (id, updatedData) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const characters = await CharacterService.getCharacters();
      const updatedCharacters = characters.map(char =>
        char.id === id ? { ...char, ...updatedData } : char
      );
      localStorage.setItem('charactersData', JSON.stringify(updatedCharacters));
      return updatedCharacters;
    },

    deleteCharacter: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const characters = await CharacterService.getCharacters();
      const updatedCharacters = characters.filter(char => char.id !== id);
      localStorage.setItem('charactersData', JSON.stringify(updatedCharacters));
      return updatedCharacters;
    },

    addCharacter: async (newCharacter) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const characters = await CharacterService.getCharacters();
      const newId = Math.max(...characters.map(c => c.id), 0) + 1;
      const characterToAdd = { ...newCharacter, id: newId };
      const updatedCharacters = [...characters, characterToAdd];
      localStorage.setItem('charactersData', JSON.stringify(updatedCharacters));
      return updatedCharacters;
    }
  };

  const CharacterTable = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCharacter, setCurrentCharacter] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
      const fetchCharacters = async () => {
        try {
          setLoading(true);
          const data = await CharacterService.getCharacters();
          setCharacters(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCharacters();
    }, []);

    const handleEdit = (character) => {
      setCurrentCharacter(character);
      setIsAdding(false);
      setIsModalOpen(true);
    };

    const handleAdd = () => {
      setCurrentCharacter({
        name: '',
        race: '',
        class: '',
        level: ''
      });
      setIsAdding(true);
      setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
      try {
        setLoading(true);
        const updatedCharacters = await CharacterService.deleteCharacter(id);
        setCharacters(updatedCharacters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        let updatedCharacters;

        if (isAdding) {
          updatedCharacters = await CharacterService.addCharacter(currentCharacter);
        } else {
          updatedCharacters = await CharacterService.updateCharacter(
            currentCharacter.id,
            currentCharacter
          );
        }

        setCharacters(updatedCharacters);
        setIsModalOpen(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentCharacter(prev => ({
        ...prev,
        [name]: name === 'level' ? parseInt(value) || 0 : value
      }));
    };

    if (loading && characters.length === 0) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      );
    }
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text gradient-bg mb-4">
          Character Manager
        </h1>
        <p className="text-xl text-gray-600">
          Manage your fantasy characters with ease
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Race
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {characters.map((character) => (
                <tr key={character.id} className="hover:bg-gray-50 character-card">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">
                          {character.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {character.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{character.race}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {character.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, character.level * 5)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">{character.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(character)}
                      className="mr-3 text-indigo-600 hover:text-indigo-900"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(character.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleAdd}
          className="gradient-bg hover:opacity-90 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg glow transition-all duration-300"
        >
          ➕ Add New Character
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isAdding ? 'Add New Character' : 'Edit Character'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentCharacter.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="race">
                    Race
                  </label>
                  <select
                    id="race"
                    name="race"
                    value={currentCharacter.race}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select a race</option>
                    <option value="Human">Human</option>
                    <option value="Elf">Elf</option>
                    <option value="Dwarf">Dwarf</option>
                    <option value="Hobbit">Hobbit</option>
                    <option value="Maia">Maia</option>
                    <option value="Orc">Orc</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
                    Class
                  </label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    value={currentCharacter.class}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                    Level
                  </label>
                  <input
                    type="number"
                    id="level"
                    name="level"
                    min="1"
                    max="100"
                    value={currentCharacter.level}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="gradient-bg hover:opacity-90 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen">
      <CharacterTable />
    </div>
  );
};




export default PersonnageLocal;