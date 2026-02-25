import React, { useEffect, useState } from 'react';
import styles from './SuccessCelebration.module.css';
import { IoCheckmark } from 'react-icons/io5';

interface ConfettiPiece {
  id: number;
  left: string;
  top: string;
  color: string;
  shape: 'circle' | 'triangle' | 'rectangle' | 'curve';
  size: number;
  rotation: number;
}

interface SuccessCelebrationProps {
  isOpen: boolean;
  onClose?: () => void;
  certificateCode?: string;
  eventName?: string;
  registeredCount?: number;
  nonRegisteredCount?: number;
  autoCloseDelay?: number;
}

const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({ 
  isOpen,
  onClose,
  certificateCode = '77A1293B84F213C5',
  eventName = '31st Karnataka State Archery Championship',
  registeredCount = 1200,
  nonRegisteredCount = 1340,
  autoCloseDelay = 5000
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const colors = [
      '#FF1493', // Pink/Magenta
      '#00FF00', // Bright Green
      '#0066FF', // Blue
      '#FFD700', // Gold/Yellow
      '#FF6600', // Orange
      '#9932CC', // Purple
      '#00CED1', // Cyan
    ];

    const shapes: Array<'circle' | 'triangle' | 'rectangle' | 'curve'> = [
      'circle', 'triangle', 'rectangle', 'curve'
    ];

    const pieces: ConfettiPiece[] = [];
    
    // Create confetti pieces around the checkmark area
    for (let i = 0; i < 40; i++) {
      pieces.push({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${5 + Math.random() * 70}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
      });
    }
    
    setConfetti(pieces);

    // Auto close after delay
    if (onClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  const renderConfettiPiece = (piece: ConfettiPiece) => {
    const baseStyle: React.CSSProperties = {
      left: piece.left,
      top: piece.top,
      transform: `rotate(${piece.rotation}deg)`,
    };

    switch (piece.shape) {
      case 'circle':
        return (
          <div
            key={piece.id}
            className={`${styles.confetti} ${styles.confettiCircle}`}
            style={{
              ...baseStyle,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={piece.id}
            className={`${styles.confetti}`}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
            }}
          />
        );
      case 'rectangle':
        return (
          <div
            key={piece.id}
            className={`${styles.confetti} ${styles.confettiRectangle}`}
            style={{
              ...baseStyle,
              width: piece.size * 1.5,
              height: piece.size * 0.5,
              backgroundColor: piece.color,
            }}
          />
        );
      case 'curve':
        return (
          <div
            key={piece.id}
            className={`${styles.confetti}`}
            style={{
              ...baseStyle,
              width: piece.size * 1.5,
              height: piece.size * 1.5,
              border: `${piece.size / 4}px solid ${piece.color}`,
              borderColor: `${piece.color} transparent transparent transparent`,
              borderRadius: '50%',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Confetti Area with Checkmark */}
        <div className={styles.confettiArea}>
          {/* Confetti pieces */}
          <div className={styles.confettiContainer}>
            {confetti.map(renderConfettiPiece)}
          </div>
          
          {/* Checkmark Circle */}
          <div className={styles.checkmarkCircle}>
            <IoCheckmark className={styles.checkmarkIcon} />
          </div>
        </div>

        {/* Certificate Code */}
        <div className={styles.certificateCode}>{certificateCode}</div>
        
        {/* Event Name */}
        <div className={styles.eventName}>{eventName}</div>
        
        {/* Success Message */}
        <div className={styles.successMessage}>All certificates issued successfully!</div>
        
        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={styles.statLine}>
            {registeredCount} Certificates generated for registered users
          </div>
          <div className={styles.statLine}>
            {nonRegisteredCount} Certificates generated for non-registered users
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCelebration;
