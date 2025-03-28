// OrderAssignment.jsx
import { useState } from 'react';
import axios from 'axios';

function OrderAssignment({ orderId, partners }) {
  const [partnerId, setPartnerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/orders/assign', {
        orderId,
        partnerId
      });
      alert('Order assigned successfully!');
      // Refresh orders list
    } catch (err) {
      alert(err.response?.data?.error || 'Assignment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <select 
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
      >
        <option value="">Select Partner</option>
        {partners.map(p => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleAssign}
        disabled={!partnerId || isLoading}
      >
        {isLoading ? 'Assigning...' : 'Assign Order'}
      </button>
    </div>
  );
}