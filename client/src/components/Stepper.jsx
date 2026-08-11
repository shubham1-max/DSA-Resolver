import { motion } from 'framer-motion';

export default function Stepper({ steps, currentStep = 0 }) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="stepper-item">
            <div className="stepper-indicator-col">
              <motion.div
                className={`stepper-dot ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                }`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{String(index + 1).padStart(2, '0')}</span>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="stepper-line-track">
                  <motion.div
                    className="stepper-line-fill"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
            <div className={`stepper-content ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}>
              <h4 className="stepper-label">{step.label}</h4>
              {step.description && <p className="stepper-desc">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
