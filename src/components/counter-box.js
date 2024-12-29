import './counter-box.css'

import { useState } from 'react';

export const CounterBox = ({daily_rogreress}) =>{
    const [count, setCount] = useState(daily_rogreress);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <div className="counter-box">
      <button className="counter-btn-negative" onClick={decrement}>
        -
      </button>
      <div className="counter-small-box">{count}</div>
      <button className="counter-btn-positive" onClick={increment}>
        +
      </button>
    </div>
  );
};