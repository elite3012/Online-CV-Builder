import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';

import { templates } from '../data/templates';
import { TemplateCard } from './TemplateCard';

const tabCategories = [
  'All',
  'Modern',
  'Minimal',
  'Classic',
  'Creative',
  'Professional',
  'Elegant',
];

export default function TemplateGallery({ onUseTemplate, searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState(0);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      activeTab === 0 || template.tags.includes(tabCategories[activeTab]);

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText =
      `${template.name} ${template.desc} ${template.tags.join(' ')}`.toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <Box
      sx={{
        p: 4,
        flexGrow: 1,
        mt: '80px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'white',
          border: '1px solid #e0e0e0',
          mb: 4,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#52b0c3"
            sx={{ fontFamily: "'Helvetica', sans-serif", mb: 1 }}
          >
            Choose Your Template
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select a professional template that matches your style. You can
            change it anytime.
          </Typography>
        </Box>

        {/* Tabs Filter */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            mb: 4,
            gap: { xs: 1, sm: 2 },
          }}
        >
          {tabCategories.map((tabLabel, index) => {
            const isActive = activeTab === index;
            const displayLabel =
              tabLabel === 'All' ? 'All Templates' : tabLabel;

            return (
              <Box
                key={tabLabel}
                onClick={() => setActiveTab(index)}
                sx={{
                  position: 'relative',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  color: isActive ? '#102a43' : 'text.secondary',
                  fontWeight: isActive ? 'bold' : 'medium',
                  transition: 'color 0.2s ease',
                  userSelect: 'none',
                }}
              >
                {displayLabel}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: '#52b0c3',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Templates Grid */}
        <Box sx={{ width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: filteredTemplates.length ? 'grid' : 'block',
                  gridTemplateColumns: 'repeat(auto-fit, 250px)',
                  gap: filteredTemplates.length ? 4 : 0,
                  justifyContent: 'center',
                  maxWidth: '900px',
                  mx: 'auto',
                }}
              >
                {filteredTemplates.length === 0 ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 6 }}
                  >
                    No templates match your search.
                  </Typography>
                ) : (
                  filteredTemplates.map((item) => (
                    <Box key={item.id}>
                      <TemplateCard item={item} onUse={() => onUseTemplate(item)} />
                    </Box>
                  ))
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
}
