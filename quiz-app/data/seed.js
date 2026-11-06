// Starting data for QuizArena. lib/db.js copies this into data/db.json
// the first time the app runs. Delete db.json to start over.
import { gradeAnswers } from "@/lib/quiz";

const quizzes = [
  {
    id: "javascript-basics",
    title: "JavaScript Basics",
    description: "Types, variables, arrays and the everyday quirks of JavaScript.",
    topic: "JS",
    level: "Beginner",
    color: "amber",
    timeLimit: 150, // seconds for the whole quiz
    questions: [
      {
        id: "q1",
        text: "What does typeof null return?",
        options: [
          { id: "a", text: '"null"' },
          { id: "b", text: '"object"' },
          { id: "c", text: '"undefined"' },
          { id: "d", text: '"number"' },
        ],
        answer: "b",
        explanation:
          'A bug from the very first version of JavaScript that was never fixed. Check for null with === null instead.',
      },
      {
        id: "q2",
        text: "Which keyword declares a variable that can't be reassigned?",
        options: [
          { id: "a", text: "var" },
          { id: "b", text: "let" },
          { id: "c", text: "const" },
          { id: "d", text: "static" },
        ],
        answer: "c",
        explanation:
          "const stops reassignment. The value itself can still change: you can push to a const array.",
      },
      {
        id: "q3",
        text: 'What is the result of "5" + 3?',
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "NaN" },
          { id: "c", text: '"8"' },
          { id: "d", text: '"53"' },
        ],
        answer: "d",
        explanation:
          'When one side of + is text, JavaScript joins both as text. Write Number("5") + 3 to add them.',
      },
      {
        id: "q4",
        text: "Which array method returns a new array and leaves the original alone?",
        options: [
          { id: "a", text: "map()" },
          { id: "b", text: "push()" },
          { id: "c", text: "sort()" },
          { id: "d", text: "splice()" },
        ],
        answer: "a",
        explanation:
          "map() builds a new array from what your function returns. push, sort and splice all change the array you call them on.",
      },
      {
        id: "q5",
        text: "What does === check that == does not?",
        options: [
          { id: "a", text: "Only the value" },
          { id: "b", text: "The value and the type, without converting either" },
          { id: "c", text: "Whether both use the same variable name" },
          { id: "d", text: "Nothing, they are the same" },
        ],
        answer: "b",
        explanation: '== converts types first, so 0 == "0" is true. === does not, so 0 === "0" is false.',
      },
    ],
  },
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "State, props, keys and effects: the ideas every React app is built on.",
    topic: "React",
    level: "Beginner",
    color: "sky",
    timeLimit: 180,
    questions: [
      {
        id: "q1",
        text: "What does useState return?",
        options: [
          { id: "a", text: "The current value only" },
          { id: "b", text: "A setter function only" },
          { id: "c", text: "An array: the current value and a setter" },
          { id: "d", text: "An object with get() and set()" },
        ],
        answer: "c",
        explanation: "That's why you destructure it: const [count, setCount] = useState(0).",
      },
      {
        id: "q2",
        text: "Why does each item in a list need a key prop?",
        options: [
          { id: "a", text: "Tailwind uses it for styling" },
          { id: "b", text: "React uses it to match items between renders" },
          { id: "c", text: "It makes the item focusable" },
          { id: "d", text: "HTML requires it" },
        ],
        answer: "b",
        explanation:
          "Keys tell React which item is which, so it updates, moves or removes the right one. Use a stable id, not the index.",
      },
      {
        id: "q3",
        text: "What happens when you call a state setter like setCount(5)?",
        options: [
          { id: "a", text: "count is 5 on the very next line" },
          { id: "b", text: "The page reloads" },
          { id: "c", text: "Nothing until you call render()" },
          { id: "d", text: "React renders the component again with the new value" },
        ],
        answer: "d",
        explanation:
          "The variable in the current render never changes. React renders the component again, and in that render count is 5.",
      },
      {
        id: "q4",
        text: "Which hook is meant for syncing with something outside React, like a timer?",
        options: [
          { id: "a", text: "useEffect" },
          { id: "b", text: "useMemo" },
          { id: "c", text: "useRef" },
          { id: "d", text: "useContext" },
        ],
        answer: "a",
        explanation:
          "useEffect runs after render and can return a cleanup function, which is exactly what a setInterval needs.",
      },
      {
        id: "q5",
        text: "How does a parent component pass data to a child?",
        options: [
          { id: "a", text: "With localStorage" },
          { id: "b", text: "With props" },
          { id: "c", text: "With a global variable" },
          { id: "d", text: "With CSS variables" },
        ],
        answer: "b",
        explanation:
          "Props flow down from parent to child. For data many components need, Context saves passing it through every level.",
      },
    ],
  },
  {
    id: "nextjs-app-router",
    title: "Next.js App Router",
    description: "Pages, Server Components, dynamic routes and Server Actions.",
    topic: "Next.js",
    level: "Intermediate",
    color: "violet",
    timeLimit: 180,
    questions: [
      {
        id: "q1",
        text: "In the App Router, which file shows the UI for a URL?",
        options: [
          { id: "a", text: "index.js" },
          { id: "b", text: "view.js" },
          { id: "c", text: "page.js" },
          { id: "d", text: "route.js" },
        ],
        answer: "c",
        explanation:
          "page.js makes a folder visible as a page. route.js is for endpoints that return data, not UI.",
      },
      {
        id: "q2",
        text: "Without any directive, components in the app folder are...",
        options: [
          { id: "a", text: "Server Components" },
          { id: "b", text: "Client Components" },
          { id: "c", text: "Static HTML only" },
          { id: "d", text: "Web Components" },
        ],
        answer: "a",
        explanation:
          'Everything is a Server Component until a file says "use client". Server Components can read files and databases directly.',
      },
      {
        id: "q3",
        text: "What does a folder named [quizId] create?",
        options: [
          { id: "a", text: "A private folder" },
          { id: "b", text: "A route group" },
          { id: "c", text: "An API route" },
          { id: "d", text: "A dynamic segment" },
        ],
        answer: "d",
        explanation: "Square brackets match any value in that spot of the URL. The page reads it from params.quizId.",
      },
      {
        id: "q4",
        text: "Which line lets a component use useState and onClick?",
        options: [
          { id: "a", text: '"use server"' },
          { id: "b", text: '"use client"' },
          { id: "c", text: '"use state"' },
          { id: "d", text: '"use strict"' },
        ],
        answer: "b",
        explanation:
          '"use client" marks the file as a Client Component, which runs in the browser and can use hooks and events.',
      },
      {
        id: "q5",
        text: "After a Server Action saves new data, what does revalidatePath do?",
        options: [
          { id: "a", text: "Deletes the page" },
          { id: "b", text: "Reloads the whole browser tab" },
          { id: "c", text: "Marks the page as out of date so it renders again with fresh data" },
          { id: "d", text: "Clears all cookies" },
        ],
        answer: "c",
        explanation:
          "The page renders again on the server with the new data, and React updates only what changed. No full reload.",
      },
    ],
  },
];

const participants = [
  { id: "p1", name: "Maya Chen" },
  { id: "p2", name: "Tanvir Hasan" },
  { id: "p3", name: "Lena Fischer" },
  { id: "p4", name: "Sadia Islam" },
  { id: "p5", name: "Arif Khan" },
];

// Turns "30 hours ago" into a date string, so the seed always looks recent
function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

// picks = one letter per question, "-" = skipped. "bcd-b" means q1: b, q2: c, q3: d, q4 skipped, q5: b
function makeAttempt(id, quizId, participantId, picks, timeTaken, hours) {
  const quiz = quizzes.find((item) => item.id === quizId);

  const answers = {};
  [...picks].forEach((letter, index) => {
    if (letter !== "-") answers[quiz.questions[index].id] = letter;
  });

  const result = gradeAnswers(quiz, answers); // the same grading as real players
  return { id, quizId, participantId, ...result, timeTaken, createdAt: hoursAgo(hours) };
}

export function createSeedData() {
  return {
    quizzes,
    participants,
    attempts: [
      // JavaScript Basics: correct answers are "bcdab"
      makeAttempt("a1", "javascript-basics", "p2", "dcdac", 120, 52),
      makeAttempt("a2", "javascript-basics", "p1", "bcdab", 74, 30),
      makeAttempt("a3", "javascript-basics", "p2", "bcdaa", 61, 28),
      makeAttempt("a4", "javascript-basics", "p3", "bcdab", 92, 50),
      makeAttempt("a5", "javascript-basics", "p4", "acdab", 61, 20),
      makeAttempt("a6", "javascript-basics", "p5", "bbca-", 150, 8),
      // React Fundamentals: correct answers are "cbdab"
      makeAttempt("a7", "react-fundamentals", "p2", "cbdab", 105, 26),
      makeAttempt("a8", "react-fundamentals", "p1", "cbdcb", 88, 24),
      makeAttempt("a9", "react-fundamentals", "p4", "cadab", 131, 12),
      makeAttempt("a10", "react-fundamentals", "p3", "abdab", 97, 6),
      // Next.js App Router: correct answers are "cadbc"
      makeAttempt("a11", "nextjs-app-router", "p3", "cadbc", 140, 22),
      makeAttempt("a12", "nextjs-app-router", "p5", "cadba", 99, 10),
      makeAttempt("a13", "nextjs-app-router", "p1", "badbc", 120, 4),
    ],
  };
}
