// Collection of example texts for different modes
const textCollections = {
  normal: [
    "The quick brown fox jumps over the lazy dog.",
    "How vexingly quick daft zebras jump!",
    "Pack my box with five dozen liquor jugs.",
    "Amazingly few discotheques provide jukeboxes.",
    "Sphinx of black quartz, judge my vow.",
    "A quick movement of the enemy will jeopardize five gunboats.",
    "Crazy Fredrick bought many very exquisite opal jewels.",
    "The five boxing wizards jump quickly.",
    "Jinxed wizards pluck ivy from the big quilt.",
    "Waltz, bad nymph, for quick jigs vex."
  ],
  flirty: [
    "Your eyes are like stars, shining brightly in the night sky, guiding me home.",
    "The touch of your hand sends shivers down my spine, like electricity coursing through my veins.",
    "Your smile could light up even the darkest of rooms, bringing warmth to my heart.",
    "Every moment spent with you feels like a dream I never want to wake up from.",
    "The sound of your laughter is the sweetest melody I've ever heard.",
    "When our eyes meet across the room, time seems to stand still, as if the universe pauses just for us.",
    "Your presence in my life is like finding a rare gem in a field of stones.",
    "If kisses were snowflakes, I'd send you a blizzard of affection.",
    "My heart beats a special rhythm whenever you're near, a song only you can inspire.",
    "Like a butterfly drawn to a beautiful flower, I'm captivated by your charm and grace."
  ],
  developer: [
    "function calculateWPM(typedChars, timeInSeconds) {\n  const minutes = timeInSeconds / 60;\n  const words = typedChars / 5; // Standard: 5 chars = 1 word\n  return Math.round(words / minutes);\n}",
    "const createTypingTest = ({ mode, duration }) => {\n  return {\n    mode,\n    duration,\n    started: false,\n    completed: false,\n    startTime: null,\n    errors: 0,\n    accuracy: 100\n  };\n};",
    "interface TypingResult {\n  wpm: number;\n  accuracy: number;\n  duration: number;\n  characters: number;\n  errors: number;\n  mode: string;\n}",
    "class TextGenerator {\n  constructor(collection) {\n    this.collection = collection;\n  }\n  \n  getRandomText() {\n    const index = Math.floor(Math.random() * this.collection.length);\n    return this.collection[index];\n  }\n}",
    "function handleKeyPress(event) {\n  if (!isTypingActive) {\n    startTest();\n    return;\n  }\n  \n  const expectedChar = currentText[currentPosition];\n  const typedChar = event.key;\n  \n  if (typedChar === expectedChar) {\n    correctChars++;\n  } else {\n    errorChars++;\n  }\n  \n  currentPosition++;\n  updateDisplay();\n}"
  ]
};

/**
 * Get a random text for the specified mode and scale it based on test duration
 * @param mode The typing mode (normal, flirty, or developer)
 * @param duration Optional test duration in seconds (defaults to 30s)
 * @returns A random text for the specified mode, sized appropriately for the test duration
 */
export async function getRandomText(mode: string, duration: number = 30): Promise<string> {
  // Default to normal mode if the mode is not recognized
  const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
  
  // Calculate how many texts we need based on duration and average reading speed
  // Assuming average typing speed of ~40 WPM and 5 chars per word
  // This means ~200 chars per minute or ~3.33 chars per second
  // Add buffer to ensure we have enough text even for fast typists
  // 5 chars per second is a reasonable estimate with buffer
  const neededChars = duration * 5;
  
  // Create a shuffled copy of the collection
  const shuffled = [...collection].sort(() => 0.5 - Math.random());
  
  let result = "";
  let charCount = 0;
  
  // Keep adding texts until we have enough characters
  while (charCount < neededChars) {
    // If we've used all texts, reshuffle the collection
    if (shuffled.length === 0) {
      shuffled.push(...[...collection].sort(() => 0.5 - Math.random()));
    }
    
    // Get a text and add it to the result
    const nextText = shuffled.pop() || "";
    if (result) result += " ";
    result += nextText;
    charCount = result.length;
  }
  
  return result;
}

/**
 * Get multiple random texts for the specified mode, optionally scaling them for a specific duration
 * @param mode The typing mode
 * @param count The number of texts to return
 * @param duration Optional test duration in seconds to scale text size (defaults to 30s)
 * @returns An array of random texts
 */
export async function getRandomTexts(mode: string, count: number, duration: number = 30): Promise<string[]> {
  const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
  
  // For shorter durations, just return random samples from the collection
  if (duration <= 30) {
    // Shuffle the collection and take 'count' items
    const shuffled = [...collection].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, collection.length));
  }
  
  // For longer durations, generate appropriately sized texts
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Get a single scaled text
    const text = await getRandomText(mode, duration);
    results.push(text);
  }
  
  return results;
}
