import { Chip } from '@mui/material';
import {
  CheckCircle,
  Pending,
  HourglassBottom,
  Cancel,
} from '@mui/icons-material';

const statusConfig = {
  pending: {
    color: 'warning',
    icon: <Pending fontSize="small" />,
    label: 'Pending',
  },
  assigned: {
    color: 'info',
    icon: <HourglassBottom fontSize="small" />,
    label: 'Assigned',
  },
  in_progress: {
    color: 'primary',
    icon: <HourglassBottom fontSize="small" />,
    label: 'In Progress',
  },
  completed: {
    color: 'success',
    icon: <CheckCircle fontSize="small" />,
    label: 'Completed',
  },
  rejected: {
    color: 'error',
    icon: <Cancel fontSize="small" />,
    label: 'Rejected',
  },
};

export default function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
}