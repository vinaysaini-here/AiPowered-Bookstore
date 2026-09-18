export interface LearningContentItem {
    _id: string;
    title: string;
    subject: string;
    author: string;
    description: string;
    fileUrl?: string;
    imageUrl?: string;
    purchasedAt: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface GeneratedQuiz {
    _id: string;
    note: string;
    title: string;
    subject: string;
    questions: QuizQuestion[];
    createdAt: string;
    questionCount?: number;
    attemptsCount?: number;
    latestScore?: number | null;
}

export interface QuizAttemptAnswer {
    questionIndex: number;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
}

export interface QuizAttempt {
    _id: string;
    quiz: string | { _id: string; title: string; subject: string };
    note: string;
    title: string;
    subject: string;
    answers: QuizAttemptAnswer[];
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracy: number;
    durationSeconds: number;
    createdAt: string;
}

export interface TopicStat {
    topic: string;
    attempts: number;
    averageAccuracy: number;
}

export interface PerformanceHistoryItem {
    attempt: string;
    quiz: string;
    note: string;
    score: number;
    subject: string;
    attemptedAt: string;
}

export interface LearningAnalytics {
    totalQuizzesAttempted: number;
    averageScore: number;
    strongTopics: TopicStat[];
    weakTopics: TopicStat[];
    topicBreakdown: TopicStat[];
    performanceHistory: PerformanceHistoryItem[];
}
