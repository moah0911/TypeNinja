import { 
  users, 
  typingTests, 
  userSettings,
  type User, 
  type InsertUser,
  type TypingTest,
  type InsertTypingTest,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";

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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveTypingTest(test: InsertTypingTest): Promise<TypingTest>;
  getTypingTests(userId?: number): Promise<TypingTest[]>;
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  getTexts(mode: string, count?: number): string[];
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private typingTests: TypingTest[];
  private userSettings: Map<number, UserSettings>;
  private currentUserId: number;
  private currentTestId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.typingTests = [];
    this.userSettings = new Map();
    this.currentUserId = 1;
    this.currentTestId = 1;
    this.currentSettingsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveTypingTest(test: InsertTypingTest): Promise<TypingTest> {
    const id = this.currentTestId++;
    const timestamp = new Date();
    const newTest: TypingTest = { ...test, id, timestamp };
    this.typingTests.push(newTest);
    return newTest;
  }

  async getTypingTests(userId?: number): Promise<TypingTest[]> {
    if (userId) {
      return this.typingTests.filter(test => test.userId === userId);
    }
    return this.typingTests;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    let userSettings = this.userSettings.get(userId);
    
    if (!userSettings) {
      // Create default settings if they don't exist
      const id = this.currentSettingsId++;
      userSettings = {
        id,
        userId,
        soundEnabled: true,
        caretStyle: 'line',
        showKeyboard: false,
        showLiveWpm: true,
        smoothCaret: true,
        theme: 'default',
        fontFamily: 'Roboto Mono',
      };
    }

    // Update with new settings
    const updatedSettings = { ...userSettings, ...settings };
    this.userSettings.set(userId, updatedSettings);
    
    return updatedSettings;
  }

  getTexts(mode: string, count: number = 1): string[] {
    const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
    
    if (count === 1) {
      const randomIndex = Math.floor(Math.random() * collection.length);
      return [collection[randomIndex]];
    }
    
    // Get multiple random texts without duplicates
    const shuffled = [...collection].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, collection.length));
  }
}

export const storage = new MemStorage();
