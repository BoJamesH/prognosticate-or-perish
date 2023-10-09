import { useState, useEffect } from 'react';
import './notification.css'

function Notification({ message, duration }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration]);

  return (
    isVisible && (
      <div className="notification">
        {message}
      </div>
    )
  );
}

export default Notification;
