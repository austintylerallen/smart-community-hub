import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';

const Notifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const socket = io('http://localhost:4001');

    socket.on('newEvent', (event) => {
      enqueueSnackbar(`New Event: ${event.title}`, { variant: 'info' });
    });

    return () => {
      socket.disconnect();
    };
  }, [enqueueSnackbar]);

  return null;
};

export default Notifications;
