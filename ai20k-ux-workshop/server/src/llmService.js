import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, buildUserPrompt } from './prompt.js';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
export const ACTIVE_MODEL = GEMINI_MODEL;

// Helper to check active provider
function getActiveProvider() {
  if (process.env.OPENAI_API_KEY) {
    return {
      type: 'openai',
      key: process.env.OPENAI_API_KEY,
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-5.4-nano'
    };
  }
  if (process.env.OPENROUTER_API_KEY) {
    const baseUrl = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
    return {
      type: 'openrouter',
      key: process.env.OPENROUTER_API_KEY,
      url: `${baseUrl}/chat/completions`,
      model: 'deepseek-v4-flash'
    };
  }
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    return {
      type: 'gemini',
      key: geminiKey,
      model: GEMINI_MODEL
    };
  }
  return { type: 'mock' };
}

// Timeout helper (15 seconds)
function withTimeout(promise, ms = 15000) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('LLM_TIMEOUT'));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// 1-in-8 simulated failure check
function checkSimulatedFailure() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const isFail = Math.floor(Date.now() / 1000) % 8 === 0;
  if (isFail) {
    throw new Error('LLM_SIMULATED_FAIL');
  }
}

// Call external OpenAI / OpenRouter HTTP endpoint
async function callChatCompletionAPI(provider, systemInstruction, userPrompt) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${provider.key}`
  };
  
  if (provider.type === 'openrouter') {
    headers['HTTP-Referer'] = 'http://localhost:3000';
    headers['X-Title'] = 'Research Navigator';
  }

  const body = {
    model: provider.model,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  };

  const res = await fetch(provider.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`LLM_API_ERROR: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('LLM_RESPONSE_EMPTY');
  }
  return content;
}

// -------------------------------------------------------------
// FAKE FALLBACK SEED DATA
// -------------------------------------------------------------
function getMockChatResponse(promptText, currentStep) {
  const prompt = (promptText || '').toLowerCase();
  
  let classification = {
    narrowedTopic: "Your research interest",
    questions: [
      "What specific population are you focused on?",
      "What timeframe/period should the study cover?",
      "What specific outcome variables are you measuring?"
    ],
    keywords: ["research", "methodology"],
    domain: "General Sciences",
    confidence: 65
  };

  if (prompt.includes('sleep') || prompt.includes('academic') || prompt.includes('gpa')) {
    classification = {
      narrowedTopic: "The effect of sleep duration and quality on academic performance in university students",
      questions: [
        "What specific population are you interested in (e.g., undergraduate vs. graduate)?",
        "How will you measure sleep quality (self-reported surveys vs. actigraphy)?",
        "Are you comparing sleep patterns during exam periods vs. regular semesters?"
      ],
      keywords: ["sleep duration", "academic performance", "university students", "GPA", "sleep quality"],
      domain: "Health Sciences / Education",
      confidence: 85
    };
  } else if (prompt.includes('climate') || prompt.includes('agriculture') || prompt.includes('crop')) {
    classification = {
      narrowedTopic: "Impact of climate change on crop yield in Southeast Asian rice farming",
      questions: [
        "What specific region of Southeast Asia are you focusing on?",
        "Which climate variables (temperature rise, flood events, soil salinity) are primary?",
        "Are you investigating farmer adaptation strategies or crop genetic tolerance?"
      ],
      keywords: ["climate change", "rice yield", "Southeast Asia", "crop adaptation", "temperature impact"],
      domain: "Environmental Science / Agriculture",
      confidence: 82
    };
  } else if (prompt.includes('machine learning') || prompt.includes('healthcare') || prompt.includes('diabetes')) {
    classification = {
      narrowedTopic: "Machine learning for early diagnosis of Type 2 diabetes using EHR data",
      questions: [
        "What type of electronic health records (EHR) will you utilize?",
        "Which machine learning algorithms (e.g., random forests, neural networks) do you plan to compare?",
        "How will you handle missing or unbalanced data in clinical datasets?"
      ],
      keywords: ["machine learning", "early diagnosis", "Type 2 diabetes", "EHR data", "predictive modeling"],
      domain: "Computer Science / Medicine",
      confidence: 78
    };
  } else if (prompt.includes('social media') || prompt.includes('mental health') || prompt.includes('anxiety')) {
    classification = {
      narrowedTopic: "Impact of Instagram usage on anxiety in adolescents aged 13–18",
      questions: [
        "How do you define and measure 'social media usage' (time spent, active posting vs passive scrolling)?",
        "What clinical scale will you use to evaluate anxiety levels?",
        "Are you factoring in peer-group influence or screen time limits?"
      ],
      keywords: ["social media", "Instagram", "mental health", "anxiety", "adolescents"],
      domain: "Psychology / Social Sciences",
      confidence: 80
    };
  } else if (prompt.trim().length < 10) {
    classification.confidence = 35; 
    classification.narrowedTopic = "Your topic needs more specificity. Consider focusing on a specific population, time period, or outcome.";
  }

  const step = currentStep || 'clarify_topic';
  let nextStep = 'define_problem';
  let text = '';
  let citations = [
    { source_name: 'Research Methods Guide (2024)', excerpt: 'A well-defined research question is the foundation of any systematic review.', context: 'Core scoping chapter' }
  ];

  if (step === 'clarify_topic') {
    text = `Welcome! I've analyzed your interest in **"${promptText}"**. Based on my classification, this fits in the **${classification.domain}** domain.\n\nTo help narrow this topic, please consider: \n1. ${classification.questions[0]}\n2. ${classification.questions[1]}\n3. ${classification.questions[2]}\n\nLet's refine this question together before we proceed.`;
    nextStep = 'define_problem';
  } else if (step === 'define_problem') {
    text = `Great progress. We are narrowing your topic to: **"${classification.narrowedTopic}"**.\n\nNow, let's formulate a specific Research Question. A strong research question should be clear, focused, and arguable. For example:\n* *"How does sleep duration affect GPA in undergraduate students?"*\n\nDoes this match your research direction, or would you like to modify the key variables?`;
    nextStep = 'build_search_strategy';
    citations = [
      { source_name: 'Academic Writing Handbook', excerpt: 'Feasible questions specify population, intervention, comparison, and outcome (PICO).', context: 'Research design section' }
    ];
  } else if (step === 'build_search_strategy') {
    text = `Based on your research question, I've drafted a recommended search strategy.\n\n- **Suggested Keywords:** ${classification.keywords.join(', ')}\n- **Simulated Boolean Query:** \`(${classification.keywords.slice(0, 2).join(' OR ')}) AND (${classification.keywords.slice(2, 4).join(' OR ') || 'research'})\`\n\nPlease select the databases you want to search and adjust keywords as needed above.`;
    nextStep = 'run_paper_search';
  } else if (step === 'run_paper_search') {
    text = `Ready to search databases. Please click **Confirm & Search** above to retrieve candidate papers. We will look for papers matching: \`"${classification.narrowedTopic}"\`.`;
    nextStep = 'screen_papers';
  } else if (step === 'screen_papers') {
    text = `I have fetched papers. Now let's screen them by applying your inclusion and exclusion criteria. Please review the papers listed in the table and check their relevance scores.`;
    nextStep = 'extract_data';
  } else if (step === 'extract_data') {
    text = `Excellent. Now, let's extract structured data from your selected papers. Click **Run Extraction** on any paper in the list to extract research problem, method, dataset, results, and limitations.`;
    nextStep = 'analyze_gaps';
  } else if (step === 'analyze_gaps') {
    text = `I've analyzed your extracted literature. I've found a notable research gap: \n\n* **Identified Gap:** Most literature focuses on broad populations, but there is very little study on how this topic behaves during high-stress periods (like exam seasons or regional droughts).\n\nDo you want to formulate a research hypothesis around this gap?`;
    nextStep = 'build_literature_matrix';
  } else if (step === 'build_literature_matrix') {
    text = `Let's visualize this in a comparison table. Review the **Literature Matrix** below to compare variables, metrics, and methods across all included papers.`;
    nextStep = 'draft_synthesis';
  } else if (step === 'draft_synthesis') {
    text = `I've drafted a narrative synthesis. Here is the draft Research Problem Card. Review it, make edits, and prepare it for your mentor.`;
    nextStep = 'mentor_review';
  } else {
    text = `All steps are completed! Here is your Mentor Review Brief. You can now export your research package as a Markdown or JSON file.`;
    nextStep = 'mentor_review';
  }

  return {
    text,
    reasoning: `Providing guidance for Step: ${step}. (Mock Fallback - Key Missing). Confidence: ${classification.confidence}.`,
    step,
    suggestedNext: nextStep,
    confidence: classification.confidence,
    citations,
    follow_up_questions: classification.questions
  };
}

// -------------------------------------------------------------
// EXPORTED API FUNCTIONS
// -------------------------------------------------------------

export async function askResearch({ prompt, currentStep, history, criteria }) {
  checkSimulatedFailure();

  const provider = getActiveProvider();
  
  if (provider.type === 'mock') {
    return getMockChatResponse(prompt, currentStep);
  }

  const systemInstruction = buildSystemPrompt();
  const formattedUserPrompt = buildUserPrompt({ prompt, currentStep, history, sessionCriteria: criteria });

  let attempts = 0;
  while (attempts < 2) {
    try {
      attempts++;
      let rawText = '';

      if (provider.type === 'openai' || provider.type === 'openrouter') {
        rawText = await withTimeout(callChatCompletionAPI(provider, systemInstruction, formattedUserPrompt), 15000);
      } else if (provider.type === 'gemini') {
        const aiClient = new GoogleGenerativeAI(provider.key);
        const responseSchema = {
          type: 'object',
          properties: {
            text: { type: 'string' },
            reasoning: { type: 'string' },
            step: { type: 'string' },
            suggestedNext: { type: 'string' },
            confidence: { type: 'integer' },
            citations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source_name: { type: 'string' },
                  excerpt: { type: 'string' },
                  context: { type: 'string' }
                },
                required: ['source_name', 'excerpt']
              }
            },
            follow_up_questions: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['text', 'reasoning', 'step', 'suggestedNext', 'confidence', 'citations', 'follow_up_questions']
        };

        const model = aiClient.getGenerativeModel({
          model: provider.model,
          systemInstruction,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.7,
          },
        });

        const result = await withTimeout(model.generateContent(formattedUserPrompt), 15000);
        rawText = result.response.text();
      }

      const parsed = JSON.parse(rawText);
      if (!parsed.text || !parsed.step || typeof parsed.confidence !== 'number') {
        throw new Error('Malformed JSON schema from LLM');
      }
      
      parsed.confidence = Math.max(0, Math.min(100, parsed.confidence));
      return parsed;

    } catch (err) {
      console.warn(`[llmService] askResearch Attempt ${attempts} failed:`, err.message);
      if (attempts >= 2) {
        console.warn('[llmService] Falling back to mock data after double failure');
        return getMockChatResponse(prompt, currentStep);
      }
    }
  }
}

function getMockExtractionResponse(title, abstract, authors, year) {
  const fields = {
    problem: `Investigates issues related to the study's topic, specifically focusing on how inputs affect outcomes in university cohorts.`,
    method: `Empirical study utilizing surveys, statistical correlation, and longitudinal regression analysis.`,
    dataset: `Survey data collected from a cohort of undergraduate students (N=150) over a 16-week semester.`,
    metric: `GPA (Grade Point Average), sleep duration metrics, and self-reported sleep quality scale values.`,
    result: `Showed a positive correlation (r=0.45, p<0.01) between consistent sleep duration and cumulative GPA.`,
    limitation: `Self-reported survey data may introduce recall bias; sample size was limited to a single institution.`,
    futureWork: `Replicate findings using actigraph sleep tracking devices and expand the sample size across multiple universities.`,
    relevance: `Directly demonstrates the quantitative link between student behaviors and academic performance outcomes.`,
    sourceCitation: `${authors.join(', ')} (${year}). ${title}.`
  };

  const confidenceScores = {
    problem: 85,
    method: 90,
    dataset: 75,
    metric: 88,
    result: 92,
    limitation: 28,
    futureWork: 70,
    relevance: 80,
    sourceCitation: 95
  };

  const sourcePassages = [
    `We evaluated undergraduate students (N=150) during their normal curriculum semester...`,
    `The regression coefficient showed a positive relationship between sleep duration and GPA...`,
    `Limitations include the self-reported nature of the data, which may skew accuracy...`
  ];

  return {
    fields,
    confidenceScores,
    sourcePassages
  };
}

export async function extractPaperFields({ title, abstract, authors, year }) {
  checkSimulatedFailure();

  const provider = getActiveProvider();
  
  if (provider.type === 'mock') {
    return getMockExtractionResponse(title, abstract, authors, year);
  }

  const systemInstruction = `You are an expert academic research assistant. Extract key fields from the provided paper details (title, year, abstract) and return them in a structured JSON format matching this exact schema:
{
  "fields": {
    "problem": "Main research problem/objective investigated",
    "method": "Methodology or approach used",
    "dataset": "Dataset used or N-size",
    "metric": "Key evaluation metrics",
    "result": "Key results or findings",
    "limitation": "Limitations identified",
    "futureWork": "Suggested future work directions",
    "relevance": "Relevance to current topic",
    "sourceCitation": "Standard paper citation"
  },
  "confidenceScores": {
    "problem": 0-100,
    "method": 0-100,
    "dataset": 0-100,
    "metric": 0-100,
    "result": 0-100,
    "limitation": 0-100,
    "futureWork": 0-100,
    "relevance": 0-100,
    "sourceCitation": 0-100
  },
  "sourcePassages": [
    "verbatim quote 1 from abstract",
    "verbatim quote 2 from abstract"
  ]
}
Estimate each field's confidence under 'confidenceScores' as an integer between 0 and 100. Extract 1-3 verbatim quotes as 'sourcePassages'. Keep field values concise and informative.`;
  const promptText = `Paper Details:
Title: ${title}
Year: ${year}
Authors: ${authors.join(', ')}
Abstract: ${abstract}`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      attempts++;
      let rawText = '';

      if (provider.type === 'openai' || provider.type === 'openrouter') {
        rawText = await withTimeout(callChatCompletionAPI(provider, systemInstruction, promptText), 15000);
      } else if (provider.type === 'gemini') {
        const aiClient = new GoogleGenerativeAI(provider.key);
        const responseSchema = {
          type: 'object',
          properties: {
            fields: {
              type: 'object',
              properties: {
                problem: { type: 'string' },
                method: { type: 'string' },
                dataset: { type: 'string' },
                metric: { type: 'string' },
                result: { type: 'string' },
                limitation: { type: 'string' },
                futureWork: { type: 'string' },
                relevance: { type: 'string' },
                sourceCitation: { type: 'string' }
              },
              required: ['problem', 'method', 'dataset', 'metric', 'result', 'limitation', 'futureWork', 'relevance', 'sourceCitation']
            },
            confidenceScores: {
              type: 'object',
              properties: {
                problem: { type: 'integer' },
                method: { type: 'integer' },
                dataset: { type: 'integer' },
                metric: { type: 'integer' },
                result: { type: 'integer' },
                limitation: { type: 'integer' },
                futureWork: { type: 'integer' },
                relevance: { type: 'integer' },
                sourceCitation: { type: 'integer' }
              },
              required: ['problem', 'method', 'dataset', 'metric', 'result', 'limitation', 'futureWork', 'relevance', 'sourceCitation']
            },
            sourcePassages: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['fields', 'confidenceScores', 'sourcePassages']
        };

        const model = aiClient.getGenerativeModel({
          model: provider.model,
          systemInstruction,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.2
          }
        });

        const result = await withTimeout(model.generateContent(promptText), 15000);
        rawText = result.response.text();
      }

      const parsed = JSON.parse(rawText);
      return parsed;

    } catch (err) {
      console.warn(`[llmService] extractPaperFields Attempt ${attempts} failed:`, err.message);
      if (attempts >= 2) {
        console.warn('[llmService] Falling back to mock data after double failure');
        return getMockExtractionResponse(title, abstract, authors, year);
      }
    }
  }
}
