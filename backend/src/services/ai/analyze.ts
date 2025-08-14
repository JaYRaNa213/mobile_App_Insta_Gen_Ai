// A minimal "analysis" that you can replace with real AI calls later.
// It won't crash if API keys are missing. It infers basic tags by file extension.
type AnalysisResult = {
  sentiment: 'positive' | 'neutral' | 'negative';
  scenario?: string;
  emojis: string[];
  suggestedFilter?: string;
  suggestedMusic?: string;
  captions?: string[];
  tags?: string[];
};

export async function analyzeMedia(key: string, type: 'image' | 'video'): Promise<AnalysisResult> {
  // --- Heuristic demo (replace with OpenAI / Google Vision / Rekognition) ---
  const name = key.toLowerCase();

  const tags: string[] = [];
  if (name.includes('party')) tags.push('party', 'friends');
  if (name.includes('travel')) tags.push('travel', 'outdoor');
  if (name.includes('sun') || name.includes('beach')) tags.push('sunny', 'beach');

  const sentiment: AnalysisResult['sentiment'] =
    tags.includes('party') || tags.includes('sunny') ? 'positive' : 'neutral';

  const scenario = tags.includes('beach')
    ? 'beach'
    : tags.includes('travel')
      ? 'travel'
      : tags.includes('party')
        ? 'party'
        : 'generic';

  const emojis = scenario === 'party'
    ? ['🎉', '🥳', '🎵']
    : scenario === 'beach'
      ? ['🏖️', '☀️', '🌊']
      : scenario === 'travel'
        ? ['✈️', '📸', '🗺️']
        : ['✨', '😊'];

  const suggestedFilter =
    scenario === 'beach' ? 'warm' :
    scenario === 'party' ? 'vivid' :
    'auto';

  const suggestedMusic =
    scenario === 'party' ? 'upbeat_pop' :
    scenario === 'travel' ? 'chill_lofi' :
    scenario === 'beach' ? 'tropical_house' :
    'ambient';

  const captions = [
    `Vibes: ${scenario} • Mood: ${sentiment}`,
    `#${scenario} #instaGenAI`
  ];

  return {
    sentiment,
    scenario,
    emojis,
    suggestedFilter,
    suggestedMusic,
    captions,
    tags: Array.from(new Set(tags))
  };
}


