import { X } from "lucide-react";

export default function AuthHead({ label, title, onClose }) {
  return (
    <div className="panel-head">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close" title="Close">
        <X size={16} />
      </button>
    </div>
  );
}
