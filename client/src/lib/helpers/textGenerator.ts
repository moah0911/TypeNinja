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
 * Get a random text for the specified mode
 * @param mode The typing mode (normal, flirty, or developer)
 * @returns A random text for the specified mode
 */
export async function getRandomText(mode: string): Promise<string> {
  // Default to normal mode if the mode is not recognized
  const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Get multiple random texts for the specified mode
 * @param mode The typing mode
 * @param count The number of texts to return
 * @returns An array of random texts
 */
export async function getRandomTexts(mode: string, count: number): Promise<string[]> {
  const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
  
  // Shuffle the collection and take 'count' items
  const shuffled = [...collection].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, collection.length));
}
