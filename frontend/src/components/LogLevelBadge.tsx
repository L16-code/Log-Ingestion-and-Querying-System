import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { LogLevel } from '../types/log.types';

interface LogLevelBadgeProps extends Omit<ChipProps, 'label' | 'color'> {
  level: LogLevel;
  size?: 'small' | 'medium';
}

const LogLevelBadge: React.FC<LogLevelBadgeProps> = ({ level, size = 'small', ...props }) => {
  const getColor = (): ChipProps['color'] => {
    switch (level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getLabel = () => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <Chip
      label={getLabel()}
      color={getColor()}
      size={size}
      sx={{
        fontWeight: 600,
        minWidth: 70,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
      {...props}
    />
  );
};

export default LogLevelBadge;
