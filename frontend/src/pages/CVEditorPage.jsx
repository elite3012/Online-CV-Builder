// src/pages/CVEditorPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/apiService';
import SafePreviewText from '../utils/SafePreviewText';

export default function CVEditorPage() {
  const [cvId] = useState(1); // sau này sẽ lấy từ router hoặc dashboard
  const [cvData, setCvData] = useState({
    id: 1,
    title: '',
    summary: '',
    experience: '',
    goal: '',
    projectLinkText: '',
    skills: ''
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
        summary: data?.summary ?? '',
        // map từ experiences, projects, skills nếu có
        experience: data?.experiences?.[0]?.jobDescription ?? '',
        goal: data?.goal ?? '',
        projectLinkText: data?.projects?.[0]?.projectName ?? '',
        skills: data?.skills?.map(s => s.skillName).join(', ') ?? ''
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
      summary: cvData.summary,
      experiences: [{ jobDescription: cvData.experience }],
      projects: [{ projectName: cvData.projectLinkText }],
      skills: cvData.skills.split(',').map(s => ({ skillName: s.trim() }))
    });
    // Sau khi save xong, reload lại từ backend để đảm bảo sync
    await loadCV();
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
            <label htmlFor="title" style={styles.label}>CV Title</label>
            <input id="title" name="title" value={cvData.title} onChange={handleChange} placeholder="Enter CV title" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label htmlFor="summary" style={styles.label}>Summary</label>
            <textarea id="summary" name="summary" value={cvData.summary} onChange={handleChange} placeholder="Enter CV summary" style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} />
          </div>

          <div style={styles.field}>
            <label htmlFor="experience" style={styles.label}>Experience Description</label>
            <textarea id="experience" name="experience" value={cvData.experience} onChange={handleChange} placeholder="Describe your experience" style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }} />
          </div>

          <div style={styles.field}>
            <label htmlFor="goal" style={styles.label}>Goal</label>
            <input id="goal" name="goal" value={cvData.goal} onChange={handleChange} placeholder="Career goal" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label htmlFor="projectLinkText" style={styles.label}>Project Link Text</label>
            <input id="projectLinkText" name="projectLinkText" value={cvData.projectLinkText} onChange={handleChange} placeholder="Link text (no JS executable)" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label htmlFor="skills" style={styles.label}>Skills</label>
            <input id="skills" name="skills" value={cvData.skills} onChange={handleChange} placeholder="Add skills safely" style={styles.input} />
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

          {/* Safe Preview Display (No raw HTML injection allowed - UC5B, UC6, US12) */}
          <div style={styles.previewBox}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>Safe Preview Output:</h3>
            
            <div style={styles.previewItem}>
              <strong>Title:</strong> <SafePreviewText text={cvData.title} />
            </div>
            <div style={styles.previewItem}>
              <strong>Summary:</strong> <SafePreviewText text={cvData.summary} multiline />
            </div>
            <div style={styles.previewItem}>
              <strong>Experience:</strong> <SafePreviewText text={cvData.experience} multiline />
            </div>
            <div style={styles.previewItem}>
              <strong>Goal:</strong> <SafePreviewText text={cvData.goal} multiline />
            </div>
            <div style={styles.previewItem}>
              <strong>Project:</strong> <SafePreviewText text={cvData.projectLinkText} />
            </div>
            <div style={styles.previewItem}>
              <strong>Skills:</strong> <SafePreviewText text={cvData.skills} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  previewBox: {
    marginTop: '24px',
    padding: '16px',
    borderRadius: '12px',
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  previewItem: {
    padding: '8px 0',
    borderBottom: '1px dashed #cbd5e1',
    color: '#334155',
    lineHeight: '1.5'
  },
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