import React from 'react';

const Render = ({temp,time}) => {
  console.log('Received Props:', temp,time);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <td>{temp} °F</td>
          </div>
          <div className="col-3">
            <p>
              {formatTime(time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Render;




