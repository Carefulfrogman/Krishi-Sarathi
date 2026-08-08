import React from 'react';
import SustainabilityRewards from '../components/SustainabilityRewards';
import { mockData } from '../services/api';

export const Rewards = () => {
  return (
    <div className="max-w-7xl mx-auto py-2">
      <SustainabilityRewards farms={mockData.farms} />
    </div>
  );
};

export default Rewards;
