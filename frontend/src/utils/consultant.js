// utils/consultant.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { updateClientStatus, setCurrentClient, clearCurrentClient } from '../redux/clientsSlice';

export const useConsultant = () => {
  const dispatch = useDispatch();
  const { currentClient } = useSelector((state) => state.clients);
  const { user } = useSelector((state) => state.auth);
  const agentName = user?.name || 'Unknown Agent';

  const handleConsult = useCallback(
    (client) => {
      if (client.status !== 'queued' || client.agent) {
        toast.warning('This client is already being consulted');
        return;
      }

      const clientWithStart = {
        ...client,
        agent: agentName,
        consultationStart: new Date().toISOString(),
      };
      dispatch(setCurrentClient(clientWithStart));
      dispatch(updateClientStatus({ id: client._id, status: 'consulting', agent: agentName }))
        .unwrap()
        .then(() => {
          toast.success(`Started consultation with ${client.name}`);
        })
        .catch((error) => {
          toast.error(error.message || 'Failed to start consultation');
          dispatch(clearCurrentClient());
        });
    },
    [dispatch, agentName]
  );

  const handleDone = useCallback(() => {
    if (currentClient && currentClient.status === 'consulting') {
      dispatch(updateClientStatus({ id: currentClient._id, status: 'done' }))
        .unwrap()
        .then(() => {
          toast.success('Client consultation completed');
          dispatch(clearCurrentClient());
        })
        .catch((error) => toast.error(error.message || 'Failed to update client status'));
    } else {
      toast.warning('No active consultation to complete');
    }
  }, [dispatch, currentClient]);

  return { handleConsult, handleDone, currentClient, agentName };
};