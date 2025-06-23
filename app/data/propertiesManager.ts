// data/propertiesManager.ts - Manages different Monopoly property versions

import fakeCashProperties from './fakeCashProperties';
import standardProperties from './standardProperties';

export type GameVersion = 'fake-cash' | 'standard';

export const getProperties = (version: GameVersion) => {
  switch (version) {
    case 'fake-cash':
      return fakeCashProperties;
    case 'standard':
      return standardProperties;
    default:
      return fakeCashProperties; // Default to fake cash version
  }
};

export const getVersionInfo = (version: GameVersion) => {
  switch (version) {
    case 'fake-cash':
      return {
        name: 'Fake Cash Version',
        description: 'Custom version with higher property values and rents',
        startingFunds: 1500,
        defaultStartingFunds: 1500
      };
    case 'standard':
      return {
        name: 'Standard Monopoly',
        description: 'Official Monopoly rules with standard property values',
        startingFunds: 1500,
        defaultStartingFunds: 1500
      };
    default:
      return {
        name: 'Fake Cash Version',
        description: 'Custom version with higher property values and rents',
        startingFunds: 1500,
        defaultStartingFunds: 1500
      };
  }
};

export const getAvailableVersions = () => {
  return [
    {
      value: 'fake-cash',
      label: 'Fake Cash Version',
      description: 'Custom version with higher property values and rents'
    },
    {
      value: 'standard',
      label: 'Standard Monopoly',
      description: 'Official Monopoly rules with standard property values'
    }
  ];
}; 