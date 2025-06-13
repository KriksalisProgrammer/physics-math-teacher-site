'use client';

import { useState, useEffect } from 'react';

interface StatItemProps {
  icon: string;
  number: number;
  label: string;
  delay?: number;
}

const StatItem = ({ icon, number, label, delay = 0 }: StatItemProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = number / 50;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= number) {
          setCount(number);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <div className="text-center group hover:scale-105 transition-transform duration-300">
      <div className="text-4xl mb-2 group-hover:animate-bounce">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
        {count.toLocaleString()}+
      </div>
      <div className="text-blue-200 text-sm font-medium">{label}</div>
    </div>
  );
};

interface StatsProps {
  dictionary: any;
}

const Stats = ({ dictionary }: StatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      <StatItem
        icon="👨‍🎓"
        number={1250}
        label={dictionary.students || "Студентів"}
        delay={0}
      />
      <StatItem
        icon="👩‍🏫"
        number={45}
        label={dictionary.teachers || "Викладачів"}
        delay={200}
      />
      <StatItem
        icon="📚"
        number={320}
        label={dictionary.lessons || "Уроків"}
        delay={400}
      />
      <StatItem
        icon="🏆"
        number={95}
        label={dictionary.success_rate || "% Успішності"}
        delay={600}
      />
    </div>
  );
};

export default Stats;
