import React from 'react';
import styles from './QuantityCounter.module.css';

interface QuantityCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantityCounter: React.FC<QuantityCounterProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.counter}>
      <button
        className={styles.button}
        onClick={handleDecrement}
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={handleDirectInput}
        min={min}
        max={max}
      />
      <button
        className={styles.button}
        onClick={handleIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default QuantityCounter;