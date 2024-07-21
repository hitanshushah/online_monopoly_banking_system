"use client";

import React, { useState } from 'react';
import { MantineProvider, Select, Input } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home: React.FC = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [startingFunds, setStartingFunds] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSelectChange = (value: string | null) => {
    setNumberOfPlayers(value ? parseInt(value) : null);
    setPlayerNames([]);
  };

  const handleNameInputChange = (index: number, value: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);
  };

  const handleStartingFundsChange = (value: string | null) => {
    setStartingFunds(value);
  };

  const handleGenerateJSON = async () => {
    const players = [];
    if (numberOfPlayers === null) {
      toast.error("Please Select number of players to start the game!");
      return;
    }

    for (let i = 0; i < numberOfPlayers; i++) {
      const playerName = playerNames[i] || `Player ${i + 1}`;
      players.push({ name: playerName, funds: startingFunds ? parseInt(startingFunds) : 1500, properties: {}, debt: 0 });
    }

    try {
      const playersData = JSON.stringify(players);
      router.push(`/dashboard?players=${playersData}`);
    } catch (error) {
      console.error('Error redirecting to dashboard:', error);
    }
  };

  return (
    <MantineProvider>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8 mt-10">Monopoly Banking System</h1>

        <div className="w-64 mb-4">
          <Select
            label="Number of Players"
            placeholder="Select"
            data={['2', '3', '4', '5', '6']}
            value={numberOfPlayers ? numberOfPlayers.toString() : null}
            onChange={(value) => handleSelectChange(value)}
          />
        </div>

        <div className="flex space-x-4">
          {numberOfPlayers &&
            Array.from({ length: numberOfPlayers }).map((_, index) => (
              <div key={index} className="w-48">
                <Input.Wrapper label={`Player ${index + 1}`}>
                  <Input
                    placeholder="Enter Name"
                    value={playerNames[index] || ''}
                    onChange={(event) => handleNameInputChange(index, event.currentTarget.value)}
                  />
                </Input.Wrapper>
              </div>
            ))}
        </div>

        <div className="w-64 mt-4">
          {numberOfPlayers && (
            <Select
              label="Select Starting Funds"
              placeholder="Select"
              data={['1500', '2000', '2500', '3000']}
              value={startingFunds || ''}
              onChange={(value) => handleStartingFundsChange(value)}
            />
          )}
        </div>

        <div className="mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
            onClick={handleGenerateJSON}
          >
            Start Game
          </button>
        </div>
      </div>
      <ToastContainer />
    </MantineProvider>
  );
};

export default Home;
