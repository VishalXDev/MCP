import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { AssignmentInd, LocationOn } from '@mui/icons-material';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order, partners, onAssign }) {
  const [selectedPartner, setSelectedPartner] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedPartner) return;
    setIsAssigning(true);
    try {
      await onAssign(order._id, selectedPartner);
      setSelectedPartner('');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Order #{order._id.slice(-6)}</Typography>
          <OrderStatusBadge status={order.status} />
        </Box>

        <Box display="flex" alignItems="center" mt={1} mb={2}>
          <LocationOn color="action" fontSize="small" />
          <Typography variant="body2" ml={1}>
            {order.pickupLocation}
          </Typography>
        </Box>

        {order.status === 'pending' && (
          <Box>
            <Select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              disabled={isAssigning}
            >
              <MenuItem value="">
                <em>Select partner</em>
              </MenuItem>
              {partners.map((partner) => (
                <MenuItem key={partner._id} value={partner._id}>
                  {partner.name}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              startIcon={<AssignmentInd />}
              onClick={handleAssign}
              disabled={!selectedPartner || isAssigning}
              fullWidth
            >
              {isAssigning ? <CircularProgress size={24} /> : 'Assign Order'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}