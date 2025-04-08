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
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
  // JavaScript code examples
  developer: [
    "function calculateWPM(typedChars, timeInSeconds) {\n  const minutes = timeInSeconds / 60;\n  const words = typedChars / 5; // Standard: 5 chars = 1 word\n  return Math.round(words / minutes);\n}",
    "const createTypingTest = ({ mode, duration }) => {\n  return {\n    mode,\n    duration,\n    started: false,\n    completed: false,\n    startTime: null,\n    errors: 0,\n    accuracy: 100\n  };\n};",
    "interface TypingResult {\n  wpm: number;\n  accuracy: number;\n  duration: number;\n  characters: number;\n  errors: number;\n  mode: string;\n}",
    "class TextGenerator {\n  constructor(collection) {\n    this.collection = collection;\n  }\n  \n  getRandomText() {\n    const index = Math.floor(Math.random() * this.collection.length);\n    return this.collection[index];\n  }\n}",
    "function handleKeyPress(event) {\n  if (!isTypingActive) {\n    startTest();\n    return;\n  }\n  \n  const expectedChar = currentText[currentPosition];\n  const typedChar = event.key;\n  \n  if (typedChar === expectedChar) {\n    correctChars++;\n  } else {\n    errorChars++;\n  }\n  \n  currentPosition++;\n  updateDisplay();\n}"
  ],
  // Python code examples
  python: [
    "def calculate_wpm(typed_chars, time_in_seconds):\n    minutes = time_in_seconds / 60\n    words = typed_chars / 5  # Standard: 5 chars = 1 word\n    return round(words / minutes)",
    "class TypingTest:\n    def __init__(self, mode, duration):\n        self.mode = mode\n        self.duration = duration\n        self.started = False\n        self.completed = False\n        self.start_time = None\n        self.errors = 0\n        self.accuracy = 100",
    "def get_random_text(collection):\n    \"\"\"Return a random text from the collection.\"\"\"\n    import random\n    return random.choice(collection)",
    "def handle_keypress(event):\n    global is_typing_active, current_position\n    \n    if not is_typing_active:\n        start_test()\n        return\n    \n    expected_char = current_text[current_position]\n    typed_char = event.char\n    \n    if typed_char == expected_char:\n        correct_chars += 1\n    else:\n        error_chars += 1\n        \n    current_position += 1\n    update_display()",
    "from typing import List, Dict, Optional\n\nclass TextGenerator:\n    def __init__(self, texts: List[str]):\n        self.texts = texts\n        \n    def get_text_for_duration(self, duration: int) -> str:\n        \"\"\"Returns text sized for the given duration in seconds.\"\"\"\n        target_length = duration * 5\n        result = \"\"\n        \n        while len(result) < target_length:\n            result += random.choice(self.texts) + \" \"\n            \n        return result.strip()"
  ],
  // Java code examples
  java: [
    "public class TypingTest {\n    private String mode;\n    private int duration;\n    private boolean started;\n    private boolean completed;\n    private long startTime;\n    private int errors;\n    private double accuracy;\n    \n    public TypingTest(String mode, int duration) {\n        this.mode = mode;\n        this.duration = duration;\n        this.started = false;\n        this.completed = false;\n        this.startTime = 0;\n        this.errors = 0;\n        this.accuracy = 100.0;\n    }\n}",
    "public int calculateWPM(int typedChars, int timeInSeconds) {\n    double minutes = timeInSeconds / 60.0;\n    double words = typedChars / 5.0; // Standard: 5 chars = 1 word\n    return (int) Math.round(words / minutes);\n}",
    "import java.util.Random;\nimport java.util.List;\n\npublic class TextGenerator {\n    private List<String> collection;\n    \n    public TextGenerator(List<String> collection) {\n        this.collection = collection;\n    }\n    \n    public String getRandomText() {\n        Random rand = new Random();\n        int index = rand.nextInt(collection.size());\n        return collection.get(index);\n    }\n}",
    "public void handleKeyPress(KeyEvent event) {\n    if (!isTypingActive) {\n        startTest();\n        return;\n    }\n    \n    char expectedChar = currentText.charAt(currentPosition);\n    char typedChar = event.getKeyChar();\n    \n    if (typedChar == expectedChar) {\n        correctChars++;\n    } else {\n        errorChars++;\n    }\n    \n    currentPosition++;\n    updateDisplay();\n}",
    "import java.util.*;\n\npublic interface TypingResult {\n    int getWpm();\n    double getAccuracy();\n    int getDuration();\n    int getCharacters();\n    int getErrors();\n    String getMode();\n}"
  ],
  // C# code examples
  csharp: [
    "public class TypingTest\n{\n    public string Mode { get; set; }\n    public int Duration { get; set; }\n    public bool Started { get; set; }\n    public bool Completed { get; set; }\n    public DateTime? StartTime { get; set; }\n    public int Errors { get; set; }\n    public double Accuracy { get; set; }\n    \n    public TypingTest(string mode, int duration)\n    {\n        Mode = mode;\n        Duration = duration;\n        Started = false;\n        Completed = false;\n        StartTime = null;\n        Errors = 0;\n        Accuracy = 100.0;\n    }\n}",
    "public int CalculateWPM(int typedChars, int timeInSeconds)\n{\n    double minutes = timeInSeconds / 60.0;\n    double words = typedChars / 5.0; // Standard: 5 chars = 1 word\n    return (int)Math.Round(words / minutes);\n}",
    "using System;\nusing System.Collections.Generic;\n\npublic class TextGenerator\n{\n    private List<string> _collection;\n    \n    public TextGenerator(List<string> collection)\n    {\n        _collection = collection;\n    }\n    \n    public string GetRandomText()\n    {\n        Random random = new Random();\n        int index = random.Next(_collection.Count);\n        return _collection[index];\n    }\n}",
    "private void HandleKeyPress(object sender, KeyEventArgs e)\n{\n    if (!_isTypingActive)\n    {\n        StartTest();\n        return;\n    }\n    \n    char expectedChar = _currentText[_currentPosition];\n    char typedChar = e.KeyChar;\n    \n    if (typedChar == expectedChar)\n    {\n        _correctChars++;\n    }\n    else\n    {\n        _errorChars++;\n    }\n    \n    _currentPosition++;\n    UpdateDisplay();\n}",
    "public interface ITypingResult\n{\n    int Wpm { get; }\n    double Accuracy { get; }\n    int Duration { get; }\n    int Characters { get; }\n    int Errors { get; }\n    string Mode { get; }\n}"
  ],
  // Go code examples
  go: [
    "package main\n\nimport (\n\t\"fmt\"\n\t\"math\"\n)\n\nfunc calculateWPM(typedChars int, timeInSeconds int) int {\n\tminutes := float64(timeInSeconds) / 60.0\n\twords := float64(typedChars) / 5.0 // Standard: 5 chars = 1 word\n\treturn int(math.Round(words / minutes))\n}",
    "package main\n\ntype TypingTest struct {\n\tMode      string\n\tDuration  int\n\tStarted   bool\n\tCompleted bool\n\tStartTime int64\n\tErrors    int\n\tAccuracy  float64\n}\n\nfunc NewTypingTest(mode string, duration int) *TypingTest {\n\treturn &TypingTest{\n\t\tMode:      mode,\n\t\tDuration:  duration,\n\t\tStarted:   false,\n\t\tCompleted: false,\n\t\tStartTime: 0,\n\t\tErrors:    0,\n\t\tAccuracy:  100.0,\n\t}\n}",
    "package main\n\nimport (\n\t\"math/rand\"\n\t\"time\"\n)\n\ntype TextGenerator struct {\n\tcollection []string\n}\n\nfunc NewTextGenerator(collection []string) *TextGenerator {\n\treturn &TextGenerator{collection: collection}\n}\n\nfunc (g *TextGenerator) GetRandomText() string {\n\trand.Seed(time.Now().UnixNano())\n\tindex := rand.Intn(len(g.collection))\n\treturn g.collection[index]\n}",
    "package main\n\nimport \"fmt\"\n\ntype TypingResult interface {\n\tGetWPM() int\n\tGetAccuracy() float64\n\tGetDuration() int\n\tGetCharacters() int\n\tGetErrors() int\n\tGetMode() string\n}",
    "package main\n\nfunc handleKeyPress(event KeyEvent) {\n\tif !isTypingActive {\n\t\tstartTest()\n\t\treturn\n\t}\n\t\n\texpectedChar := currentText[currentPosition]\n\ttypedChar := event.Key\n\t\n\tif typedChar == expectedChar {\n\t\tcorrectChars++\n\t} else {\n\t\terrorChars++\n\t}\n\t\n\tcurrentPosition++\n\tupdateDisplay()\n}"
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
  getTexts(mode: string, count?: number, duration?: number): string[];
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
    
    // Create a proper TypingTest object with all required fields
    // to avoid type issues with userId (ensuring it's null or a number, not undefined)
    const newTest: TypingTest = {
      id,
      userId: test.userId ?? null, // Ensure userId is either null or a number
      wpm: test.wpm,
      accuracy: test.accuracy,
      duration: test.duration,
      mode: test.mode,
      characters: test.characters,
      errors: test.errors,
      timestamp
    };
    
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

  getTexts(mode: string, count: number = 1, duration: number = 30): string[] {
    const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
    
    // More precise character targets based on test duration
    // Using a baseline of 40 WPM typing speed and 5 chars per word
    // For a 40 WPM typing speed:
    // 15s test = 10 words = 50 chars
    // 30s test = 20 words = 100 chars
    // 60s test = 40 words = 200 chars
    // 120s test = 80 words = 400 chars
    // Add a 50% buffer for faster typists (~60 WPM)
    let targetLength: number;
    switch (duration) {
      case 15:
        targetLength = 75; // 15s test (50 chars + 50% buffer)
        break;
      case 30:
        targetLength = 150; // 30s test (100 chars + 50% buffer)
        break;
      case 60:
        targetLength = 300; // 60s test (200 chars + 50% buffer)
        break;
      case 120:
        targetLength = 600; // 120s test (400 chars + 50% buffer)
        break;
      default:
        // For any other duration, calculate appropriately
        // 40 WPM = 40 * 5 chars per minute = 200 chars per minute
        // = (200/60) * duration = 3.33 * duration
        // With 50% buffer = 3.33 * 1.5 * duration = 5 * duration
        targetLength = Math.round(duration * 5);
    }
    
    const results: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // For very short tests (15s), just use a single paragraph without concatenation
      if (duration <= 15) {
        const randomIndex = Math.floor(Math.random() * collection.length);
        // If the text is too long, trim it to an appropriate length
        let text = collection[randomIndex];
        if (text.length > targetLength * 1.5) {
          // Cut at a space to avoid cutting words in half
          const cutIndex = text.lastIndexOf(' ', targetLength);
          text = text.substring(0, cutIndex > 0 ? cutIndex : targetLength);
        }
        results.push(text);
        continue;
      }
      
      // For longer tests, concatenate texts to reach the target length
      const shuffled = [...collection].sort(() => 0.5 - Math.random());
      let result = "";
      
      // Keep adding texts until we reach the target length
      while (result.length < targetLength) {
        // If we've used all texts, reshuffle the collection
        if (shuffled.length === 0) {
          shuffled.push(...[...collection].sort(() => 0.5 - Math.random()));
        }
        
        // Get a text and add it
        const nextText = shuffled.pop() || "";
        if (result) result += " ";
        result += nextText;
        
        // If we've exceeded the target by too much, trim at a sensible point
        if (result.length > targetLength * 1.2) {
          const cutIndex = result.lastIndexOf(' ', targetLength * 1.1);
          if (cutIndex > targetLength * 0.8) {
            result = result.substring(0, cutIndex);
            break;
          }
        }
      }
      
      results.push(result);
    }
    
    return results;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async saveTypingTest(test: InsertTypingTest): Promise<TypingTest> {
    const [savedTest] = await db
      .insert(typingTests)
      .values({
        ...test,
        userId: test.userId ?? null, // Ensure userId is either null or a number
        timestamp: new Date()
      })
      .returning();
    return savedTest;
  }
  
  async getTypingTests(userId?: number): Promise<TypingTest[]> {
    if (userId) {
      return db
        .select()
        .from(typingTests)
        .where(eq(typingTests.userId, userId))
        .orderBy(desc(typingTests.timestamp));
    }
    return db
      .select()
      .from(typingTests)
      .orderBy(desc(typingTests.timestamp));
  }
  
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings || undefined;
  }
  
  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    // Check if settings exist
    const existingSettings = await this.getUserSettings(userId);
    
    if (!existingSettings) {
      // Create default settings if they don't exist
      const [newSettings] = await db
        .insert(userSettings)
        .values({
          userId,
          soundEnabled: settings.soundEnabled ?? true,
          caretStyle: settings.caretStyle ?? 'line',
          showKeyboard: settings.showKeyboard ?? false,
          showLiveWpm: settings.showLiveWpm ?? true,
          smoothCaret: settings.smoothCaret ?? true,
          theme: settings.theme ?? 'default',
          fontFamily: settings.fontFamily ?? 'Roboto Mono',
        })
        .returning();
      return newSettings;
    }
    
    // Update existing settings
    const [updatedSettings] = await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, userId))
      .returning();
    return updatedSettings;
  }
  
  getTexts(mode: string, count: number = 1, duration: number = 30): string[] {
    const collection = textCollections[mode as keyof typeof textCollections] || textCollections.normal;
    
    // More precise character targets based on test duration
    // Using a baseline of 40 WPM typing speed and 5 chars per word
    // For a 40 WPM typing speed:
    // 15s test = 10 words = 50 chars
    // 30s test = 20 words = 100 chars
    // 60s test = 40 words = 200 chars
    // 120s test = 80 words = 400 chars
    // Add a 50% buffer for faster typists (~60 WPM)
    let targetLength: number;
    switch (duration) {
      case 15:
        targetLength = 75; // 15s test (50 chars + 50% buffer)
        break;
      case 30:
        targetLength = 150; // 30s test (100 chars + 50% buffer)
        break;
      case 60:
        targetLength = 300; // 60s test (200 chars + 50% buffer)
        break;
      case 120:
        targetLength = 600; // 120s test (400 chars + 50% buffer)
        break;
      default:
        // For any other duration, calculate appropriately
        // 40 WPM = 40 * 5 chars per minute = 200 chars per minute
        // = (200/60) * duration = 3.33 * duration
        // With 50% buffer = 3.33 * 1.5 * duration = 5 * duration
        targetLength = Math.round(duration * 5);
    }
    
    const results: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // For very short tests (15s), just use a single paragraph without concatenation
      if (duration <= 15) {
        const randomIndex = Math.floor(Math.random() * collection.length);
        // If the text is too long, trim it to an appropriate length
        let text = collection[randomIndex];
        if (text.length > targetLength * 1.5) {
          // Cut at a space to avoid cutting words in half
          const cutIndex = text.lastIndexOf(' ', targetLength);
          text = text.substring(0, cutIndex > 0 ? cutIndex : targetLength);
        }
        results.push(text);
        continue;
      }
      
      // For longer tests, concatenate texts to reach the target length
      const shuffled = [...collection].sort(() => 0.5 - Math.random());
      let result = "";
      
      // Keep adding texts until we reach the target length
      while (result.length < targetLength) {
        // If we've used all texts, reshuffle the collection
        if (shuffled.length === 0) {
          shuffled.push(...[...collection].sort(() => 0.5 - Math.random()));
        }
        
        // Get a text and add it
        const nextText = shuffled.pop() || "";
        if (result) result += " ";
        result += nextText;
        
        // If we've exceeded the target by too much, trim at a sensible point
        if (result.length > targetLength * 1.2) {
          const cutIndex = result.lastIndexOf(' ', targetLength * 1.1);
          if (cutIndex > targetLength * 0.8) {
            result = result.substring(0, cutIndex);
          }
        }
      }
      
      results.push(result);
    }
    
    return results;
  }
}

// Using DatabaseStorage now instead of MemStorage
export const storage = new DatabaseStorage();
