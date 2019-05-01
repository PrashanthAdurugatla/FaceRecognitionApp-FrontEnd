import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>

      <div className='light-red f3'>
        {`${name}, Your Current Entry Count Is`}
      </div>

      <div className='light-red f1'>
        {entries}
      </div>

    </div>
  );
}

export default Rank;