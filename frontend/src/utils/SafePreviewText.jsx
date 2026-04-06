import React from 'react';

/**
 * Helper to safely render user text exactly as string.
 * This naturally avoids XSS (React handles text nodes safely) 
 * but provides optional stripping/normalization for clean display.
 */
export default function SafePreviewText({ text, multiline = false }) {
  if (!text) return null;

  // React natively escapes strings (no <script> will execute when rendered as children).
  // But we can additionally strip script blocks visually to clean up the preview.
  let safeText = text.replace(/<(script|iframe|object|embed)[^>]*>.*?<\/\1>/gi, '');
  safeText = safeText.replace(/</g, '<').replace(/>/g, '>');

  if (multiline) {
    return (
      <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {safeText}
      </span>
    );
  }

  return <span>{safeText}</span>;
}