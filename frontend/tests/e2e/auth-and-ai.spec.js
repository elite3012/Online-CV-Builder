import { expect, test } from '@playwright/test';

const authUser = {
  id: 77,
  fullName: 'E2E Recruiter',
  email: 'e2e@example.com',
};

const resume = {
  id: 101,
  title: 'Applied AI Resume',
  summary: 'Built AI-assisted resume tooling with Python, React, FastAPI, and semantic matching.',
  template: { id: 1, templateName: 'Harvard' },
  personalInformation: {
    fullName: 'Tran Phuc Quy',
    jobTitle: 'Applied AI Intern',
    email: 'quy@example.com',
    phone: '0923876268',
    location: 'Ho Chi Minh City',
  },
  educations: [],
  experiences: [],
  projects: [],
  certificates: [],
  skills: [
    { skillName: 'Python' },
    { skillName: 'LangChain' },
    { skillName: 'Docker' },
  ],
};

async function mockAuthenticatedApi(page) {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({ json: authUser });
  });

  await page.route('**/api/cv', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await route.fulfill({ json: [resume] });
  });
}

test('login redirects to dashboard without storing JWT in localStorage', async ({ page }) => {
  await mockAuthenticatedApi(page);
  await page.route('**/api/auth/login', async (route) => {
    const payload = JSON.parse(route.request().postData() || '{}');
    expect(payload).toEqual({
      email: authUser.email,
      password: 'Password123!',
    });

    await route.fulfill({ json: authUser });
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill(authUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Templates Gallery')).toBeVisible();
  await expect(page.getByText('Choose Your Template')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => window.localStorage.getItem('token'))).toBeNull();
});

test('protected dashboard redirects anonymous users to login', async ({ page }) => {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 401,
      json: { message: 'Session expired. Please log in again.' },
    });
  });

  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

test('failed login keeps backend credential error on the login form', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      json: { message: 'Invalid credentials' },
    });
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill(authUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText('Invalid credentials')).toBeVisible();
  await expect(page.getByText('Your session is no longer valid. Please log in again.')).toHaveCount(0);
});

test('AI Resume Lab accepts one pasted JD, sends normalized payload, and logs out', async ({ page }) => {
  let analyzePayload;
  let logoutCalled = false;

  await mockAuthenticatedApi(page);
  await page.route('**/api/ai/analyze-jd', async (route) => {
    analyzePayload = JSON.parse(route.request().postData() || '{}');

    await route.fulfill({
      json: {
        score: 82,
        atsPassed: true,
        matchedSkills: ['python', 'langchain', 'semantic matching'],
        missingSkills: ['vector databases'],
        atsWarnings: [],
        suggestions: ['Add one concise bullet about vector search evidence.'],
        analysisEngine: 'e2e-semantic-engine',
        semanticScore: 84,
        keywordCoverage: 78,
        sectionCoverage: 80,
        strengths: ['Strong applied AI evidence.'],
        focusAreas: ['Mention vector databases explicitly.'],
        evidenceHighlights: ['Project summary references semantic matching.'],
        traceId: 'e2e-trace-123456',
      },
    });
  });
  await page.route('**/api/auth/logout', async (route) => {
    logoutCalled = true;
    await route.fulfill({ json: { message: 'Logged out successfully' } });
  });

  await page.goto('/dashboard');
  await page.getByText('AI Resume Lab').click();
  await expect(page.getByText('Applied AI Resume')).toBeVisible();

  const jdText = [
    'AI Integration Intern',
    'Build AI agents using Python, LangChain, semantic retrieval, Docker, and REST APIs.',
    'Evaluate responses, document tradeoffs, and communicate clearly with engineers.',
  ].join('\n');

  await page.getByLabel('Paste Full Job Description').fill(jdText);
  await page.getByRole('button', { name: 'Run Semantic Match' }).click();

  await expect(page.getByText('AI Match Score:')).toBeVisible();
  await expect(page.getByRole('heading', { name: '82%' })).toBeVisible();
  expect(analyzePayload).toEqual({
    cvId: resume.id,
    jdText,
    atsOnly: false,
    engine: 'auto',
  });

  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(logoutCalled).toBe(true);
});
