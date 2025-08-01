import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color,
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.01, 
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
      }}
      className="stat-card group overflow-hidden relative"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            className="text-3xl font-bold text-foreground"
          >
            {value}
          </motion.div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 
                   rounded-xl transition-colors duration-300"
      />
    </motion.div>
  );
};