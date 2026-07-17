import {
  BookOpen,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Palette,
} from "lucide-react";

export const school = {
  name: "EduBridge School LMS",
  phone: "+60 3-8800 2026",
  email: "hello@edubridge.school",
  address: "12 Learning Avenue, Kuala Lumpur",
};

export const people = {
  students: [
    "Adam Hassan", "Sara Hassan", "Maya Tan", "Noah Lim", "Aisyah Rahman", "Daniel Wong", "Sofia Lee", "Arif Zain",
    "Chloe Ng", "Irfan Malik", "Priya Nair", "Lucas Chen", "Amira Yusuf", "Ethan Goh", "Hana Ismail", "Ryan Teo",
    "Nadia Omar", "Ben Tan", "Mei Ling", "Farid Azman",
  ].map((name, index) => ({
    id: `ST2026${String(index + 1).padStart(3, "0")}`,
    name,
    grade: index % 3 === 0 ? "Grade 8" : index % 3 === 1 ? "Grade 5" : "Grade 9",
    className: index % 2 === 0 ? "A" : "B",
    email: name.toLowerCase().replaceAll(" ", ".") + "@edubridge.school",
    attendance: 88 + (index % 9),
    average: 72 + (index % 24),
    status: index % 8 === 0 ? "Needs support" : "Active",
  })),
  teachers: [
    ["Ms. Nur Aina", "Mathematics"], ["Mr. Benjamin Koh", "English"], ["Dr. Kavitha Menon", "Science"],
    ["Ms. Elena Wong", "Computer Studies"], ["Mr. Harith Idris", "History"], ["Ms. Grace Tan", "Geography"],
  ].map(([name, subject], index) => ({ id: `T20${index + 31}`, name, subject, classes: 2 + (index % 3), email: name.toLowerCase().replaceAll(" ", ".") + "@edubridge.school" })),
  parents: ["Fatimah Hassan", "Rina Tan", "Omar Rahman", "David Lim"].map((name, index) => ({ id: `P${index + 101}`, name, children: index === 0 ? ["Adam Hassan", "Sara Hassan"] : [index % 2 ? "Maya Tan" : "Noah Lim"], email: name.toLowerCase().replaceAll(" ", ".") + "@mail.com" })),
};

export const courses = [
  ["Mathematics", "Ms. Nur Aina", Calculator, "Linear equations, ratios, and problem solving", 78],
  ["English", "Mr. Benjamin Koh", Languages, "Reading, persuasive writing, and speaking", 64],
  ["Science", "Dr. Kavitha Menon", FlaskConical, "Forces, ecosystems, cells, and lab skills", 82],
  ["Computer Studies", "Ms. Elena Wong", Code2, "Digital safety, coding basics, and projects", 71],
  ["History", "Mr. Harith Idris", Landmark, "Regional history and source analysis", 58],
  ["Geography", "Ms. Grace Tan", Globe2, "Maps, climate, cities, and sustainability", 69],
  ["Art & Design", "Ms. Grace Tan", Palette, "Visual storytelling and design thinking", 74],
  ["Reading Studio", "Mr. Benjamin Koh", BookOpen, "Guided reading and vocabulary growth", 87],
].map(([name, teacher, icon, description, progress], index) => ({
  id: `course-${index + 1}`,
  name,
  teacher,
  icon,
  description,
  progress,
  lessons: 12 + index,
  image: `linear-gradient(135deg, ${["#dbeafe", "#ccfbf1", "#ecfccb", "#e0e7ff"][index % 4]}, #ffffff)`,
  nextAssignment: ["Practice Set 4", "Essay Draft", "Lab Reflection", "Mini Project"][index % 4],
  lastActivity: `${index + 1} day${index ? "s" : ""} ago`,
  schedule: index % 2 ? "Tue & Thu, 10:30 AM" : "Mon & Wed, 9:00 AM",
  grade: index % 3 === 0 ? "Grade 8A" : "Grade 5B",
}));

export const lessons = Array.from({ length: 20 }, (_, index) => ({
  id: `lesson-${index + 1}`,
  courseId: courses[index % courses.length].id,
  title: ["Understanding ratios", "Writing strong topic sentences", "Building a safe password", "Map scale practice", "Ecosystem food webs"][index % 5],
  module: `Week ${Math.floor(index / 4) + 1}`,
  duration: `${25 + (index % 4) * 10} min`,
  type: ["Video", "Reading", "Worksheet", "Practice"][index % 4],
  status: index % 5 === 4 ? "locked" : index % 3 === 0 ? "current" : "completed",
}));

export const assignments = Array.from({ length: 15 }, (_, index) => ({
  id: `assignment-${index + 1}`,
  title: ["Equation practice", "Persuasive essay", "Science lab report", "Coding reflection", "Map skills worksheet"][index % 5],
  course: courses[index % courses.length].name,
  teacher: courses[index % courses.length].teacher,
  due: new Date(2026, 6, 18 + index).toISOString(),
  marks: [20, 30, 40, 50][index % 4],
  status: ["Due soon", "Submitted", "Graded", "Overdue"][index % 4],
  priority: ["High", "Normal", "Low"][index % 3],
}));

export const quizzes = Array.from({ length: 10 }, (_, index) => ({
  id: `quiz-${index + 1}`,
  title: ["Fractions checkpoint", "Vocabulary quiz", "Forces review", "HTML basics", "History sources"][index % 5],
  course: courses[index % courses.length].name,
  questions: 8 + index,
  duration: 20 + index * 2,
  attempts: index % 2 ? 2 : 1,
  deadline: new Date(2026, 6, 22 + index).toISOString(),
  status: ["Upcoming", "Completed", "Practice"][index % 3],
}));

export const grades = courses.map((course, index) => ({
  subject: course.name,
  average: 68 + ((index * 7) % 27),
  trend: Array.from({ length: 6 }, (_, m) => ({ month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][m], score: 62 + ((index + m) * 5) % 30 })),
  feedback: index % 2 ? "Good participation; review corrections before the next quiz." : "Strong effort and steady improvement this term.",
}));

export const attendance = Array.from({ length: 30 }, (_, index) => ({
  date: new Date(2026, 6, index + 1).toISOString(),
  status: index % 13 === 0 ? "Absent" : index % 8 === 0 ? "Late" : index % 17 === 0 ? "Excused" : "Present",
  subject: courses[index % courses.length].name,
}));

export const announcements = [
  ["School science fair registration is open", "Students can register projects until July 25. Families are welcome to attend the showcase.", "School", "Pinned"],
  ["Grade 8 mathematics revision clinic", "Optional support session this Friday at 2:30 PM in Room B204.", "Course", "Priority"],
  ["Library reading challenge", "Complete four age-appropriate books this month to earn a healthy reading badge.", "School", "Normal"],
  ["Parent-teacher meeting schedule", "Bookings are available for the August progress meetings.", "Parents", "Priority"],
  ["Digital citizenship week", "Short activities this week will focus on respectful online communication.", "School", "Normal"],
].map(([title, body, audience, priority], index) => ({ id: `ann-${index + 1}`, title, body, audience, priority, read: index > 1, date: new Date(2026, 6, 15 + index).toISOString() }));

export const messages = [
  { id: "m1", from: "Ms. Nur Aina", role: "Teacher", text: "Adam, nice improvement on today's practice. Please retry question 6.", time: "9:15 AM" },
  { id: "m2", from: "School Support", role: "Staff", text: "Your device loan request has been received.", time: "Yesterday" },
  { id: "m3", from: "Mr. Benjamin Koh", role: "Teacher", text: "Essay feedback is ready. Focus on clearer examples.", time: "Mon" },
];

export const calendarEvents = [
  { id: "e1", title: "Math live class", type: "Class", date: "2026-07-20", time: "9:00 AM" },
  { id: "e2", title: "Science quiz", type: "Quiz", date: "2026-07-22", time: "11:30 AM" },
  { id: "e3", title: "Essay due", type: "Assignment", date: "2026-07-24", time: "5:00 PM" },
  { id: "e4", title: "Science fair", type: "Event", date: "2026-07-28", time: "10:00 AM" },
];

export const resources = Array.from({ length: 12 }, (_, index) => ({
  id: `res-${index + 1}`,
  title: ["Algebra formula sheet", "Essay planning guide", "Lab safety video", "Keyboard shortcuts", "Map symbols worksheet", "Revision checklist"][index % 6],
  type: ["PDF", "Video", "Worksheet", "Link"][index % 4],
  category: courses[index % courses.length].name,
  viewed: index < 4,
}));

export const notifications = [
  "New assignment posted in Mathematics",
  "Science quiz starts on July 22",
  "English essay received teacher feedback",
  "Attendance alert: one late arrival this week",
  "New school announcement available",
].map((title, index) => ({ id: `n-${index + 1}`, title, type: ["Assignment", "Quiz", "Grade", "Attendance", "Announcement"][index], read: index > 1 }));

export const chartSeries = [
  { name: "Mon", study: 45, activity: 70 },
  { name: "Tue", study: 60, activity: 76 },
  { name: "Wed", study: 35, activity: 62 },
  { name: "Thu", study: 75, activity: 82 },
  { name: "Fri", study: 55, activity: 74 },
  { name: "Sat", study: 30, activity: 48 },
  { name: "Sun", study: 40, activity: 58 },
];
