import React, { useState } from 'react';

// Define an interface for the structure of the nodes in the tree
type TreeNode = {
  name: string;
  weight: number | ((roomNumber: number) => number);
  children?: TreeNode[];
};

// Define the tree structure based on the example you provided
const characterTree: TreeNode[] = [
  {
    name: 'Angler',
    weight: 20,
    children: [
      { name: 'Angler (regular)', weight: 50 },
      { name: 'Blitz', weight: 20 },
      { name: 'Froger', weight: 15 },
      { name: 'Chainsmoker', weight: 10 },
      { name: 'Pinkie', weight: 5 },
    ],
  },
  {
    name: 'Squiddles',
    weight: (roomNumber) => {
      if (roomNumber >= 10 && roomNumber <= 30) {
        return 10;
      } else if (roomNumber >= 31 && roomNumber <= 70) {
        return 60;
      } else if (roomNumber >= 71 && roomNumber <= 100) {
        return 60;
      }
      return 0;
    },
  },
  { name: 'Wall Dwellers', weight: 4 },
  { name: 'Turrets', weight: 13 },
  { name: 'Good People', weight: 25 },
  { name: 'Pandemonium', weight: 0.2 },
  {
    name: 'Multi-monster',
    weight: (roomNumber) => (roomNumber > 21 ? 0.2 : 0),
  },
  { 
	  name: "Eyefestation",
	  weight: 10,
	  children: [
		  { name: "Eyefestation (normal)", weight: 80 },
		  { name: "Gauntlet", weight: 20}
	  ]
  }
];

// Utility function to pick a node based on weights
const pickNode = (nodes: TreeNode[], roomNumber: number): TreeNode | undefined => {
  const totalWeight = nodes.reduce((sum, node) => {
    const weight = typeof node.weight === 'function' ? node.weight(roomNumber) : node.weight;
    return sum + weight;
  }, 0);

  let randomValue = Math.random() * totalWeight;

  for (let node of nodes) {
    const weight = typeof node.weight === 'function' ? node.weight(roomNumber) : node.weight;
    if (randomValue < weight) {
      return node;
    }
    randomValue -= weight;
  }
};

const CharacterGenerator: React.FC = () => {
  const [roomNumber, setRoomNumber] = useState<number | "">("");
  const [generatedCharacter, setGeneratedCharacter] = useState<string | null>(null);

  const handleGenerate = () => {
    if (typeof roomNumber !== 'number') {
      setGeneratedCharacter('Invalid room number');
      return;
    }

    let currentNode = pickNode(characterTree, roomNumber);
    if (currentNode && currentNode.children) {
      currentNode = pickNode(currentNode.children, roomNumber);
    }
    setGeneratedCharacter(currentNode ? currentNode.name : 'No character found');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Character Generator</h1>
      <div>
        <label>
          Room Number: 
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(parseInt(e.target.value) || "")}
          />
        </label>
      </div>
      <button onClick={handleGenerate} style={{ marginTop: '10px' }}>
        Generate Character
      </button>
      {generatedCharacter && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Character:</h2>
          <p>{generatedCharacter}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterGenerator;
