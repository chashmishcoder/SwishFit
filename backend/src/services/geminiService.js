const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * GeminiService - AI Service for workout generation and performance analysis
 * Uses Google Gemini API to create personalized basketball training plans
 */
class GeminiService {
  constructor() {
    // Use gemini-pro model (free tier)
    this.model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro' 
    });
  }

  /**
   * Generate personalized basketball workout plan
   * @param {Object} playerData - Player profile and preferences
   * @returns {Object} Generated workout plan with exercises
   */
  async generateWorkout(playerData) {
    try {
      const { age, skillLevel, goals, pastPerformance, duration = 7, focusAreas } = playerData;

      // Construct detailed prompt for Gemini
      const prompt = `
You are an expert basketball coach AI specializing in personalized training programs. Generate a comprehensive ${duration}-day basketball training routine.

Player Profile:
- Age: ${age || 'Not specified'}
- Skill Level: ${skillLevel || 'intermediate'}
- Goals: ${goals || 'General skill improvement and basketball mastery'}
- Past Performance: ${pastPerformance || 'No previous data available'}
- Focus Areas: ${focusAreas || 'shooting, dribbling, defense, conditioning'}

Create a detailed weekly workout plan with the following requirements:

1. **Daily Exercises**: Each day should have 3-5 exercises covering different basketball skills
2. **Exercise Details**: For each exercise include:
   - name: Exercise name - max 100 characters (e.g., "Free Throw Shooting")
   - description: Brief explanation - max 500 characters
   - sets: Number of sets between 1-20 (e.g., 3)
   - reps: Number of repetitions per set between 1-100 (e.g., 10)
   - duration: Time in minutes between 1-180 (e.g., 15)
   - difficulty: MUST be one of: "easy", "moderate", "hard", "very-hard" (do NOT use "expert" or "advanced")
   - instructions: Step-by-step guide - max 1000 characters
   - tips: Pro tips - max 500 characters
   - day: Day number between 1-7 ONLY

3. **Progressive Difficulty**: Gradually increase intensity throughout the week
4. **Rest and Recovery**: Include rest days or lighter days if appropriate
5. **Focus Areas**: Emphasize shooting, dribbling, defense, and conditioning based on skill level
6. **Skill Level Appropriate**: Match exercises to the player's ${skillLevel} skill level

IMPORTANT CONSTRAINTS:
- Keep title under 100 characters
- Keep description under 500 characters
- Each exercise's day MUST be between 1 and 7
- Difficulty MUST be ONLY: "easy", "moderate", "hard", or "very-hard" (never use "expert", "advanced", or other values)
- Keep weeklyInsights under 1000 characters
- Keep safetyNotes under 500 characters

Return ONLY a valid JSON object with this exact structure (no additional text before or after):

{
  "title": "7-Day Basketball Training Plan - ${skillLevel}",
  "description": "Comprehensive training routine for skill improvement",
  "duration": ${duration},
  "skillLevel": "${skillLevel}",
  "estimatedTimePerDay": 45,
  "exercises": [
    {
      "day": 1,
      "name": "Exercise name",
      "description": "What this exercise does",
      "sets": 3,
      "reps": 10,
      "duration": 15,
      "difficulty": "moderate",
      "instructions": "1. Step one\\n2. Step two\\n3. Step three",
      "tips": "Pro tip for better results"
    }
  ],
  "weeklyInsights": "Overall insights about this training plan and expected improvements",
  "safetyNotes": "Important safety considerations and warm-up recommendations"
}
      `;

      // Generate content from Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      // Parse JSON
      const workoutPlan = JSON.parse(jsonText);

      // Validate required fields
      if (!workoutPlan.title || !workoutPlan.exercises || !Array.isArray(workoutPlan.exercises)) {
        throw new Error('Invalid workout plan structure from Gemini API');
      }

      // Map and validate the response to match our schema
      const mappedPlan = this.mapGeminiResponseToSchema(workoutPlan, playerData);

      return {
        success: true,
        data: mappedPlan,
        rawResponse: text,
        metadata: {
          generatedAt: new Date(),
          model: process.env.GEMINI_MODEL || 'gemini-pro',
          promptTokens: text.length // Approximate
        }
      };
    } catch (error) {
      console.error('Gemini API Error (generateWorkout):', error.message);
      
      // Return structured error
      return {
        success: false,
        error: error.message,
        errorType: error.name,
        fallbackData: this.getFallbackWorkout(playerData)
      };
    }
  }

  /**
   * Analyze player performance and provide insights
   * @param {Object} performanceData - Player's workout history and metrics
   * @returns {Object} Performance analysis and recommendations
   */
  async analyzePerformance(performanceData) {
    try {
      const { workoutHistory, progressMetrics, playerProfile } = performanceData;

      const prompt = `
You are an expert basketball performance analyst. Analyze this player's training data and provide actionable insights.

Player Profile:
${JSON.stringify(playerProfile, null, 2)}

Workout History (Last 30 days):
${JSON.stringify(workoutHistory, null, 2)}

Progress Metrics:
${JSON.stringify(progressMetrics, null, 2)}

Provide a comprehensive performance analysis with:

1. **Strengths**: Top 3 areas where the player excels
2. **Weaknesses**: Top 3 areas needing improvement
3. **Trends**: Key performance trends (improving, plateauing, declining)
4. **Recommendations**: Specific actionable recommendations for next training phase
5. **Motivational Message**: Personalized encouraging message based on progress

Return ONLY a valid JSON object with this exact structure:

{
  "strengths": [
    "Strength 1 with specific metrics",
    "Strength 2 with specific metrics",
    "Strength 3 with specific metrics"
  ],
  "weaknesses": [
    "Weakness 1 with improvement suggestions",
    "Weakness 2 with improvement suggestions",
    "Weakness 3 with improvement suggestions"
  ],
  "trends": "Detailed analysis of performance trends over time with specific examples",
  "recommendations": [
    "Recommendation 1 with specific exercises or focus areas",
    "Recommendation 2 with training intensity suggestions",
    "Recommendation 3 with timeline and goals"
  ],
  "motivationalMessage": "Personalized encouraging message highlighting progress and future potential",
  "overallScore": 75,
  "improvementAreas": ["area1", "area2"],
  "nextMilestone": "Specific achievable goal for next 2 weeks"
}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON
      let jsonText = text.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      const analysis = JSON.parse(jsonText);

      return {
        success: true,
        data: analysis,
        analyzedAt: new Date()
      };
    } catch (error) {
      console.error('Gemini Analysis Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate exercise suggestions based on player needs
   * @param {Object} params - Exercise parameters
   * @returns {Object} Exercise suggestions
   */
  async suggestExercises(params) {
    try {
      const { skillLevel, focusArea, duration, difficulty } = params;

      const prompt = `
Suggest 5 basketball exercises for:
- Skill Level: ${skillLevel}
- Focus Area: ${focusArea}
- Duration: ${duration} minutes per exercise
- Difficulty: ${difficulty}

Return ONLY valid JSON array with this structure:

[
  {
    "name": "Exercise name",
    "description": "What it improves",
    "duration": 15,
    "difficulty": "moderate",
    "instructions": "Step-by-step guide",
    "equipment": ["Basketball", "Cones"],
    "focusArea": "${focusArea}"
  }
]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let jsonText = text.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      const exercises = JSON.parse(jsonText);

      return {
        success: true,
        data: exercises
      };
    } catch (error) {
      console.error('Gemini Exercise Suggestion Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Map Gemini API response to match our database schema
   * Fixes validation issues with difficulty levels, day numbers, and text lengths
   * @param {Object} workoutPlan - Raw workout plan from Gemini
   * @param {Object} playerData - Original player data for context
   * @returns {Object} Mapped workout plan that matches our schema
   */
  mapGeminiResponseToSchema(workoutPlan, playerData) {
    // Map difficulty levels: expert -> very-hard, others stay the same
    const difficultyMap = {
      'easy': 'easy',
      'moderate': 'moderate',
      'medium': 'moderate',
      'hard': 'hard',
      'difficult': 'hard',
      'expert': 'very-hard',
      'very-hard': 'very-hard',
      'very hard': 'very-hard',
      'extreme': 'very-hard',
      'advanced': 'hard'
    };

    // Truncate text to max length
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    };

    // Map exercises and fix validation issues
    const mappedExercises = (workoutPlan.exercises || []).map((exercise, index) => {
      // Ensure day is between 1-7
      let day = parseInt(exercise.day) || (index % 7) + 1;
      if (day > 7) day = (day % 7) || 7;
      if (day < 1) day = 1;

      // Map difficulty to valid enum value
      const rawDifficulty = (exercise.difficulty || 'moderate').toLowerCase().trim();
      const mappedDifficulty = difficultyMap[rawDifficulty] || 'moderate';

      return {
        day: day,
        name: truncateText(exercise.name || 'Basketball Drill', 100),
        description: truncateText(exercise.description || 'Basketball training exercise', 500),
        sets: Math.min(Math.max(parseInt(exercise.sets) || 3, 1), 20),
        reps: Math.min(Math.max(parseInt(exercise.reps) || 10, 1), 100),
        duration: Math.min(Math.max(parseInt(exercise.duration) || 15, 1), 180),
        difficulty: mappedDifficulty,
        restTime: exercise.restTime || 60,
        instructions: truncateText(exercise.instructions || 'Follow proper form and technique', 1000),
        tips: truncateText(exercise.tips || 'Focus on consistency', 500),
        equipment: exercise.equipment || []
      };
    });

    // Ensure we have at least one exercise
    if (mappedExercises.length === 0) {
      mappedExercises.push({
        day: 1,
        name: 'Basketball Fundamentals',
        description: 'Basic basketball training exercise',
        sets: 3,
        reps: 10,
        duration: 20,
        difficulty: 'moderate',
        restTime: 60,
        instructions: 'Practice with proper form',
        tips: 'Stay focused and consistent'
      });
    }

    return {
      title: truncateText(workoutPlan.title || 'Personalized Basketball Training Plan', 100),
      description: truncateText(
        workoutPlan.description || 'A comprehensive basketball training routine',
        500
      ),
      duration: Math.min(Math.max(parseInt(workoutPlan.duration) || 7, 1), 30),
      skillLevel: (workoutPlan.skillLevel || playerData.skillLevel || 'intermediate').toLowerCase(),
      estimatedTimePerDay: Math.min(
        Math.max(parseInt(workoutPlan.estimatedTimePerDay) || 45, 5),
        180
      ),
      exercises: mappedExercises,
      weeklyInsights: truncateText(
        workoutPlan.weeklyInsights || 'Stay consistent with your training',
        1000
      ),
      safetyNotes: truncateText(
        workoutPlan.safetyNotes || 'Always warm up before training and cool down after',
        500
      ),
      tags: workoutPlan.tags || [],
      targetAudience: workoutPlan.targetAudience || playerData.skillLevel || 'intermediate'
    };
  }

  /**
   * Fallback workout when Gemini API fails
   * @param {Object} playerData - Player information
   * @returns {Object} Basic workout plan
   */
  getFallbackWorkout(playerData) {
    const { skillLevel = 'intermediate', duration = 7 } = playerData;

    return {
      title: `${duration}-Day Basketball Training Plan (${skillLevel})`,
      description: 'A balanced basketball training routine covering fundamental skills',
      duration: duration,
      skillLevel: skillLevel,
      estimatedTimePerDay: 45,
      exercises: [
        {
          day: 1,
          name: 'Free Throw Shooting',
          description: 'Practice free throw shooting to improve accuracy',
          sets: 5,
          reps: 10,
          duration: 20,
          difficulty: 'easy',
          instructions: '1. Stand at the free throw line\n2. Use proper shooting form\n3. Focus on consistency\n4. Track makes and misses',
          tips: 'Keep your elbow aligned and follow through'
        },
        {
          day: 2,
          name: 'Ball Handling Drills',
          description: 'Improve dribbling skills and ball control',
          sets: 4,
          reps: 15,
          duration: 25,
          difficulty: 'moderate',
          instructions: '1. Practice crossover dribbles\n2. Do figure-8 dribbling\n3. Practice behind-the-back dribbles\n4. Work on speed dribbling',
          tips: 'Keep your head up and use your fingertips'
        },
        {
          day: 3,
          name: 'Defensive Slides',
          description: 'Enhance defensive footwork and lateral quickness',
          sets: 3,
          reps: 20,
          duration: 15,
          difficulty: 'moderate',
          instructions: '1. Get in defensive stance\n2. Slide laterally without crossing feet\n3. Touch the line and change direction\n4. Maintain low position',
          tips: 'Stay low and keep your chest up'
        }
      ],
      weeklyInsights: 'This plan focuses on fundamental basketball skills suitable for your level. Stay consistent and you will see improvement!',
      safetyNotes: 'Always warm up for 10 minutes before starting and cool down after your workout. Stay hydrated and listen to your body.',
      isFallback: true
    };
  }

  /**
   * Check if Gemini API is properly configured
   * @returns {Boolean} Configuration status
   */
  isConfigured() {
    return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '');
  }
}

// Export singleton instance
module.exports = new GeminiService();
