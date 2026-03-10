// Validation Message Component (US12, UC6)
export default function ValidationMessage({ message, type }) {
  return <div className={`validation-${type}`}>{message}</div>;
}
