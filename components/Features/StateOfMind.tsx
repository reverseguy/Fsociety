import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoodStats } from '../../types';

interface StateOfMindProps {
  data: MoodStats;
}

const StateOfMind: React.FC<StateOfMindProps> = ({ data }) => {
  // Softer, dream-like palette
  const chartData = [
    { name: 'Thinking', value: data.overthinking, color: '#71717a' }, // Zinc 500
    { name: 'Quiet', value: data.numb, color: '#27272a' }, // Zinc 800
    { name: 'Frustrated', value: data.angry, color: '#be123c' }, // Rose 700
    { name: 'Calm', value: data.calm, color: '#059669' }, // Emerald 600
    { name: 'Sarcastic', value: data.sarcastic, color: '#7c3aed' }, // Violet 600
  ];

  return (
    <div className="w-full p-6">
      <h3 className="text-xs font-bold text-zinc-500 mb-6 text-center uppercase tracking-widest">Atmosphere</h3>
      
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.1))' }} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                itemStyle={{ color: '#e4e4e7' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-zinc-600 font-bold tracking-widest">NOW</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-y-4 gap-x-2 mt-6">
        {chartData.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-600 font-medium uppercase tracking-wide">{item.name}</span>
                <span className="text-xs text-zinc-300 font-bold">{item.value}%</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StateOfMind;