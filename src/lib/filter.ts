import { Repository } from './types';

// AI-related keywords
const AI_KEYWORDS = [
  // General AI
  'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
  'ai ', ' ml ', ' dl ', ' nlp ', ' llm',

  // Subfields
  'natural language processing', 'computer vision', 'reinforcement learning',
  'generative ai', 'supervised learning', 'unsupervised learning',

  // Models & Architectures
  'transformer', 'gpt', 'bert', 'llm', 'large language model',
  'diffusion', 'stable diffusion', 'gan', 'vae', 'cnn', 'rnn', 'lstm',
  'attention', 'embedding', 'tokenization',

  // Frameworks & Tools
  'pytorch', 'tensorflow', 'keras', 'huggingface', 'hugging face',
  'langchain', 'openai', 'anthropic', 'ollama', 'llamacpp', 'vllm',
  'onnx', 'tensorrt', 'cuda', 'jax', 'flax',

  // Applications
  'chatbot', 'chat', 'assistant', 'agent', 'rag', 'retrieval augmented',
  'text generation', 'image generation', 'speech recognition',
  'object detection', 'semantic segmentation', 'image classification',

  // Data & Training
  'fine-tuning', 'finetuning', 'fine tuning', 'training', 'inference',
  'dataset', 'pre-trained', 'pretrained', 'pre-trained model',

  // Specific models
  'whisper', 'dalle', 'midjourney', 'claude', 'gemini', 'mistral',
  'llama', 'vicuna', 'alpaca', 'chatglm', 'qwen', 'baichuan',

  // Research
  'arxiv', 'paper implementation', 'research code',
];

// AI-related GitHub topics
const AI_TOPICS = [
  'machine-learning', 'deep-learning', 'artificial-intelligence',
  'neural-network', 'nlp', 'natural-language-processing',
  'computer-vision', 'reinforcement-learning', 'generative-ai',
  'llm', 'large-language-model', 'gpt', 'chatgpt', 'transformer',
  'pytorch', 'tensorflow', 'keras', 'huggingface', 'langchain',
  'openai', 'stable-diffusion', 'diffusion-model',
  'chatbot', 'conversational-ai', 'rag', 'llm-inference',
  'fine-tuning', 'model-training', 'ai-agent', 'autonomous-agents',
];

// AI-related programming languages
const AI_LANGUAGES = [
  'python',
  'jupyter notebook',
  'julia',
  'r',
  'matlab',
];

// Check if repository is AI-related
export function isAIRelated(repo: Repository): boolean {
  // Build text to check
  const textToCheck = [
    repo.description || '',
    repo.name,
    repo.fullName,
    ...repo.topics,
  ].join(' ').toLowerCase();

  // Check language
  const language = (repo.language || '').toLowerCase();
  const isAILanguage = AI_LANGUAGES.some(lang =>
    language.includes(lang) || lang.includes(language)
  );

  // Check keywords in text
  const hasAIKeyword = AI_KEYWORDS.some(keyword =>
    textToCheck.includes(keyword.toLowerCase())
  );

  // Check topics
  const hasAITopic = repo.topics.some(topic =>
    AI_TOPICS.includes(topic.toLowerCase())
  );

  // Special check for common AI repo patterns
  const isAIRepoPattern =
    repo.name.includes('llm') ||
    repo.name.includes('gpt') ||
    repo.name.includes('bert') ||
    repo.name.includes('ai-') ||
    repo.name.startsWith('ai') ||
    repo.name.includes('-ai') ||
    repo.name.endsWith('-ai') ||
    repo.name.includes('chat') ||
    repo.name.includes('transformer');

  return hasAIKeyword || hasAITopic || isAILanguage || isAIRepoPattern;
}

// Filter repositories to AI-related only
export function filterAIRepositories(repos: Repository[]): Repository[] {
  return repos.filter(isAIRelated);
}

// Get AI match score (for sorting)
export function getAIMatchScore(repo: Repository): number {
  let score = 0;

  const textToCheck = [
    repo.description || '',
    repo.name,
    repo.fullName,
    ...repo.topics,
  ].join(' ').toLowerCase();

  // Count keyword matches
  for (const keyword of AI_KEYWORDS) {
    if (textToCheck.includes(keyword.toLowerCase())) {
      score += 1;
    }
  }

  // Count topic matches (weighted higher)
  for (const topic of repo.topics) {
    if (AI_TOPICS.includes(topic.toLowerCase())) {
      score += 2;
    }
  }

  // Language bonus
  const language = (repo.language || '').toLowerCase();
  if (AI_LANGUAGES.some(lang => language.includes(lang))) {
    score += 1;
  }

  return score;
}

// Sort repositories by AI relevance and stars
export function sortByAIRelevance(repos: Repository[]): Repository[] {
  return [...repos].sort((a, b) => {
    const scoreA = getAIMatchScore(a);
    const scoreB = getAIMatchScore(b);

    // First sort by AI match score
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // Then by stars today
    return b.starsToday - a.starsToday;
  });
}
