// CV Editor Page (UC4)
import { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/apiService';

export default function CVEditorPage() {
  const [cvId] = useState(1); // temporary until routing/selection is connected
  const [cvData, setCvData] = useState({
    id: 1,
    title: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCV();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCV = async () => {
    try {
      setLoading(true);
      setStatus('Loading...');
      const data = await apiService.getCV(cvId);

      setCvData({
        id: data?.id ?? cvId,
        title: data?.title ?? '',
      });

      setStatus('Loaded');
    } catch (error) {
      console.error('Failed to load CV:', error);
      setStatus('Failed to load CV');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      await apiService.updateCV(cvId, {
        title: cvData.title,
      });
      setStatus('Saved successfully');
    } catch (error) {
      console.error('Failed to save CV:', error);
      setStatus('Error saving');
    }
  };

  const statusStyle = useMemo(() => {
    if (status.includes('Saved')) return styles.statusSuccess;
    if (status.includes('Saving') || status.includes('Loading')) return styles.statusInfo;
    if (status.includes('Failed') || status.includes('Error')) return styles.statusError;
    return styles.statusNeutral;
  }, [status]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading CV editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <div style={styles.shell}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Your CV</h1>
       
        </div>

        <section style={styles.card}>
          <div style={styles.field}>
            <label htmlFor="title" style={styles.label}>
              CV Title
            </label>
            <input
              id="title"
              name="title"
              value={cvData.title}
              onChange={handleChange}
              placeholder="Enter CV title"
              style={styles.input}
            />
          </div>

          <div style={styles.buttonRow}>
            <button onClick={handleSave} style={styles.primaryButton}>
              Save
            </button>

            <button onClick={loadCV} style={styles.secondaryButton}>
              Reload
            </button>
          </div>

          <div style={{ ...styles.statusBox, ...statusStyle }}>
            {status || 'Ready'}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #0f172a 0%, #0ea5e9 35%, #22c55e 70%, #f8fafc 100%)',
    padding: '32px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGlowOne: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    filter: 'blur(40px)',
    top: '5%',
    left: '8%',
    pointerEvents: 'none',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.20)',
    filter: 'blur(60px)',
    bottom: '4%',
    right: '8%',
    pointerEvents: 'none',
  },
  shell: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '760px',
  },
  header: {
    marginBottom: '24px',
    color: 'white',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    margin: '0 0 10px 0',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.16)',
    border: '1px solid rgba(255,255,255,0.25)',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    textShadow: '0 8px 30px rgba(0,0,0,0.18)',
  },
  card: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(15,23,42,0.25)',
    border: '1px solid rgba(255,255,255,0.55)',
  },
  sectionTitle: {
    margin: '0 0 18px 0',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1e293b',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '1rem',
    boxSizing: 'border-box',
    background: '#ffffff',
    transition: 'all 0.2s ease',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  primaryButton: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #52b0c3, #0ea5e9)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(37,99,235,0.35)',
  },
  secondaryButton: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(15,23,42,0.12)',
    background: 'rgba(255,255,255,0.85)',
    color: '#0f172a',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  statusBox: {
    marginTop: '18px',
    padding: '12px 14px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '0.95rem',
    display: 'inline-block',
  },
  statusSuccess: {
    background: 'rgba(34,197,94,0.15)',
    color: '#166534',
    border: '1px solid rgba(34,197,94,0.25)',
  },
  statusInfo: {
    background: 'rgba(59,130,246,0.12)',
    color: '#1d4ed8',
    border: '1px solid rgba(59,130,246,0.22)',
  },
  statusError: {
    background: 'rgba(239,68,68,0.12)',
    color: '#b91c1c',
    border: '1px solid rgba(239,68,68,0.22)',
  },
  statusNeutral: {
    background: 'rgba(15,23,42,0.06)',
    color: '#334155',
    border: '1px solid rgba(15,23,42,0.10)',
  },
  loadingCard: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    color: 'white',
  },
  spinner: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    border: '6px solid rgba(255,255,255,0.25)',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
  },
};