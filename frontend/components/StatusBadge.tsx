/**
 * components/StatusBadge.tsx
 * ─────────────────────────────────────────────────────────
 * Status badge component for displaying messages with different visual states
 * ─────────────────────────────────────────────────────────
 */

"use client";

export type StatusType = "idle" | "listening" | "success" | "error";

interface StatusBadgeProps {
  message: string;
  type: StatusType;
}

export default function StatusBadge({ message, type }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (type) {
      case "listening":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "rgba(59, 130, 246, 0.3)",
          text: "#3b82f6",
          icon: "🎤",
        };
      case "success":
        return {
          bg: "rgba(34, 197, 94, 0.1)",
          border: "rgba(34, 197, 94, 0.3)",
          text: "#22c55e",
          icon: "✓",
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          text: "#ef4444",
          icon: "⚠",
        };
      default:
        return {
          bg: "rgba(128, 128, 128, 0.1)",
          border: "rgba(128, 128, 128, 0.2)",
          text: "var(--foreground)",
          icon: "●",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className="status-badge-root">
      <span className="status-icon" aria-hidden="true">
        {styles.icon}
      </span>
      <span className="status-message">{message}</span>

      <style>{`
        .status-badge-root {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: ${styles.bg};
          border: 1px solid ${styles.border};
          border-radius: 8px;
          font-size: 0.8rem;
          transition: all 0.2s ease;
          animation: statusFadeIn 0.2s ease-out;
        }

        .status-icon {
          font-size: 0.9rem;
          line-height: 1;
          opacity: 0.8;
        }

        .status-message {
          color: ${styles.text};
          flex: 1;
          font-weight: 450;
          letter-spacing: -0.01em;
        }

        @keyframes statusFadeIn {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ${
          type === "listening"
            ? `
          .status-badge-root {
            animation: statusPulse 1.2s ease-in-out infinite;
          }
          
          @keyframes statusPulse {
            0%, 100% {
              border-color: ${styles.border};
              background: ${styles.bg};
            }
            50% {
              border-color: rgba(59, 130, 246, 0.5);
              background: rgba(59, 130, 246, 0.15);
            }
          }
        `
            : ""
        }

        ${
          type === "error"
            ? `
          .status-badge-root {
            animation: statusShake 0.3s ease-out;
          }
          
          @keyframes statusShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
          }
        `
            : ""
        }
      `}</style>
    </div>
  );
}