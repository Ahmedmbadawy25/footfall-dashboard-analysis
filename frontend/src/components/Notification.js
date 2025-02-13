import React, { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationHandler = ({ status, message }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      toast.loading(message || 'Processing...');
    } else if (status === 'success') {
      setLoading(false);
      toast.dismiss();
      toast.success(message || 'Operation completed successfully!');
    } else if (status === 'error') {
      setLoading(false);
      toast.dismiss();
      toast.error(message || 'An error occurred. Please try again.');
    }
  }, [status, message]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Oval height={80} width={80} color="white" />
        </div>
      )}
      {!loading && <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />}
    </>
  );
};

export default NotificationHandler;

/*
Usage Example:

// For spinner overlay and toast notifications during state updates
<NotificationHandler status="loading" message="Updating order..." />
<NotificationHandler status="success" message="Order updated successfully!" />
<NotificationHandler status="error" message="Failed to update order." />
*/
