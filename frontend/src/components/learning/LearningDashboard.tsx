"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Gauge,
  GraduationCap,
  LoaderCircle,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import {
  GeneratedQuiz,
  LearningAnalytics,
  LearningContentItem,
  QuizAttempt,
} from "@/types/learning";

interface LearningDashboardProps {
  userName: string;
}

const emptyAnalytics: LearningAnalytics = {
  totalQuizzesAttempted: 0,
  averageScore: 0,
  strongTopics: [],
  weakTopics: [],
  topicBreakdown: [],
  performanceHistory: [],
};

export default function LearningDashboard({ userName }: LearningDashboardProps) {
  const [content, setContent] = useState<LearningContentItem[]>([]);
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuiz | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [askingExplanationFor, setAskingExplanationFor] = useState<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const loadDashboard = async (withSpinner = true) => {
    try {
      if (withSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [contentRes, quizzesRes, resultsRes, analyticsRes] = await Promise.all([
        api.get("/learning-content"),
        api.get("/generated-quizzes"),
        api.get("/results"),
        api.get("/analytics"),
      ]);

      setContent(contentRes.data.data || []);
      setQuizzes(quizzesRes.data.data || []);
      setAttempts(resultsRes.data.data || []);
      setAnalytics(analyticsRes.data.data || emptyAnalytics);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load learning dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!activeQuiz || submittedAttempt || startedAtRef.current === null) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current!) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeQuiz, submittedAttempt]);

  const beginQuiz = (quiz: GeneratedQuiz) => {
    setActiveQuiz(quiz);
    setActiveQuestion(0);
    setAnswers({});
    setSubmittedAttempt(null);
    setAiExplanations({});
    setElapsedSeconds(0);
    startedAtRef.current = Date.now();
  };

  const handleGenerateQuiz = async (noteId: string) => {
    try {
      setGeneratingFor(noteId);
      const response = await api.post("/generate-quiz", { noteId });
      const quiz: GeneratedQuiz = response.data.data;
      setQuizzes((current) => {
        const filtered = current.filter((item) => item._id !== quiz._id);
        return [quiz, ...filtered];
      });
      toast.success(response.data.cached ? "Loaded cached quiz" : "Fresh AI quiz generated");
      beginQuiz(quiz);
      await loadDashboard(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    try {
      const response = await api.post("/submit-quiz", {
        quizId: activeQuiz._id,
        answers,
        durationSeconds: elapsedSeconds,
      });
      setSubmittedAttempt(response.data.data);
      toast.success("Quiz submitted");
      await loadDashboard(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    }
  };

  const handleAskAi = async (questionIndex: number, question: string, correctAnswer: string) => {
    try {
      setAskingExplanationFor(questionIndex);
      const response = await api.post("/ask-ai", { question, correctAnswer });
      setAiExplanations((current) => ({
        ...current,
        [questionIndex]: response.data.data.explanation,
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch AI explanation");
    } finally {
      setAskingExplanationFor(null);
    }
  };

  const linkedQuizId = (attempt: QuizAttempt) =>
    typeof attempt.quiz === "string" ? attempt.quiz : attempt.quiz._id;

  const quizForNote = (noteId: string) =>
    quizzes.find((quiz) => quiz.note === noteId);

  const performanceSeries = analytics.performanceHistory.map((item, index) => ({
    name: `Quiz ${index + 1}`,
    score: item.score,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-36 rounded-3xl bg-white border border-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-800">
              <GraduationCap size={16} />
              Smart Learning Dashboard
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {userName}&apos;s study progress at a glance
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Turn purchased notes into AI quizzes, review weak spots, and keep a running score on how your learning is improving.
            </p>
          </div>
          <button
            onClick={() => loadDashboard(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "Quizzes Attempted", value: analytics.totalQuizzesAttempted, icon: Target, tone: "bg-emerald-50 text-emerald-700" },
            { label: "Average Score", value: `${analytics.averageScore}%`, icon: Gauge, tone: "bg-sky-50 text-sky-700" },
            { label: "Generated Quizzes", value: quizzes.length, icon: Brain, tone: "bg-amber-50 text-amber-700" },
            { label: "Purchased Notes", value: content.length, icon: BookOpen, tone: "bg-rose-50 text-rose-700" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <div className={`mb-4 inline-flex rounded-2xl p-3 ${item.tone}`}>
                <item.icon size={20} />
              </div>
              <div className="text-sm font-medium text-slate-500">{item.label}</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="text-slate-900" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">My Learning Content</h3>
              <p className="text-sm text-slate-500">Purchased notes that are ready for AI quiz generation.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {content.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Purchase study notes to unlock AI-powered quiz generation.
              </div>
            ) : (
              content.map((note) => {
                const existingQuiz = quizForNote(note._id);
                return (
                  <div key={note._id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{note.subject}</div>
                      <h4 className="mt-1 text-lg font-bold text-slate-900">{note.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">Purchased on {new Date(note.purchasedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {existingQuiz && (
                        <button
                          onClick={() => beginQuiz(existingQuiz)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Open Quiz
                        </button>
                      )}
                      <button
                        onClick={() => handleGenerateQuiz(note._id)}
                        disabled={generatingFor === note._id}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-70"
                      >
                        {generatingFor === note._id ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Generate Quiz
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Brain className="text-slate-900" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Performance Analytics</h3>
              <p className="text-sm text-slate-500">Spot patterns in your scores and topic strength.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-4 text-sm font-semibold text-slate-500">Recent performance</div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceSeries}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-emerald-800">
                  <TrendingUp size={18} />
                  <span className="font-bold">Strong Topics</span>
                </div>
                <div className="space-y-3">
                  {analytics.strongTopics.length === 0 ? (
                    <p className="text-sm text-emerald-700">Strong areas will appear after a few quiz attempts.</p>
                  ) : (
                    analytics.strongTopics.map((topic) => (
                      <div key={topic.topic}>
                        <div className="flex justify-between text-sm font-medium text-emerald-900">
                          <span>{topic.topic}</span>
                          <span>{topic.averageAccuracy}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-emerald-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${topic.averageAccuracy}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-amber-800">
                  <TrendingDown size={18} />
                  <span className="font-bold">Weak Topics</span>
                </div>
                <div className="space-y-3">
                  {analytics.weakTopics.length === 0 ? (
                    <p className="text-sm text-amber-700">Weak topics will show up when the system finds learning gaps.</p>
                  ) : (
                    analytics.weakTopics.map((topic) => (
                      <div key={topic.topic}>
                        <div className="flex justify-between text-sm font-medium text-amber-900">
                          <span>{topic.topic}</span>
                          <span>{topic.averageAccuracy}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-amber-100">
                          <div className="h-2 rounded-full bg-amber-500" style={{ width: `${topic.averageAccuracy}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Clock3 className="text-slate-900" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Generated Quizzes</h3>
              <p className="text-sm text-slate-500">Reuse cached quizzes and jump back into practice anytime.</p>
            </div>
          </div>

          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Your generated quizzes will show up here.
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz._id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{quiz.subject}</div>
                      <h4 className="mt-1 text-lg font-bold text-slate-900">{quiz.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {quiz.questions.length} questions · {quiz.attemptsCount || 0} attempt{quiz.attemptsCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <button
                      onClick={() => beginQuiz(quiz)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                    >
                      Start Attempt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          {!activeQuiz ? (
            <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Brain className="mb-4 text-slate-400" size={40} />
              <h3 className="text-2xl font-bold text-slate-900">Ready for a practice round</h3>
              <p className="mt-2 max-w-md text-slate-500">
                Generate a quiz from a purchased note or reopen an existing one to begin an attempt.
              </p>
            </div>
          ) : !submittedAttempt ? (
            <div>
              <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{activeQuiz.subject}</div>
                    <h3 className="text-2xl font-bold text-slate-900">{activeQuiz.title}</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    {Math.floor(elapsedSeconds / 60)}m {String(elapsedSeconds % 60).padStart(2, "0")}s
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900 transition-all"
                    style={{ width: `${((activeQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="mb-3 text-sm font-semibold text-slate-500">
                  Question {activeQuestion + 1} of {activeQuiz.questions.length}
                </div>
                <h4 className="text-xl font-bold leading-relaxed text-slate-900">
                  {activeQuiz.questions[activeQuestion].question}
                </h4>

                <div className="mt-6 space-y-3">
                  {activeQuiz.questions[activeQuestion].options.map((option) => {
                    const selected = answers[activeQuestion] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setAnswers((current) => ({ ...current, [activeQuestion]: option }))}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                          selected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setActiveQuestion((current) => Math.max(current - 1, 0))}
                  disabled={activeQuestion === 0}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>

                {activeQuestion === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveQuestion((current) => Math.min(current + 1, activeQuiz.questions.length - 1))}
                    className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                <div className="flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 size={24} />
                  <h3 className="text-2xl font-bold">Quiz Result</h3>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  {[
                    ["Total Questions", submittedAttempt.totalQuestions],
                    ["Correct", submittedAttempt.correctAnswers],
                    ["Wrong", submittedAttempt.wrongAnswers],
                    ["Accuracy", `${submittedAttempt.accuracy}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/90 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{label}</div>
                      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {submittedAttempt.answers.map((answer) => (
                  <div key={answer.questionIndex} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Question {answer.questionIndex + 1}
                        </div>
                        <h4 className="mt-2 text-base font-bold text-slate-900">{answer.question}</h4>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          answer.isCorrect
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {answer.isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Selected Answer</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{answer.selectedAnswer || "No answer selected"}</div>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Correct Answer</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{answer.correctAnswer}</div>
                      </div>
                    </div>

                    {!answer.isCorrect && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleAskAi(answer.questionIndex, answer.question, answer.correctAnswer)}
                          disabled={askingExplanationFor === answer.questionIndex}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                          {askingExplanationFor === answer.questionIndex ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Sparkles size={16} />
                          )}
                          Ask AI
                        </button>

                        <div className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-600">
                          {aiExplanations[answer.questionIndex] || answer.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Target className="text-slate-900" />
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Recent Attempts</h3>
            <p className="text-sm text-slate-500">A quick look at your latest quiz sessions.</p>
          </div>
        </div>

        <div className="space-y-4">
          {attempts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Your quiz history will start building after your first attempt.
            </div>
          ) : (
            attempts.slice(0, 5).map((attempt) => (
              <div key={attempt._id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{attempt.subject}</div>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">{attempt.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{new Date(attempt.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700">
                      {attempt.accuracy}% score
                    </div>
                    <button
                      onClick={() => {
                        const quiz = quizzes.find((item) => item._id === linkedQuizId(attempt));
                        if (quiz) {
                          setSubmittedAttempt(attempt);
                          setActiveQuiz(quiz);
                          setAiExplanations({});
                        }
                      }}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
