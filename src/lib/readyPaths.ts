/** A hand-written path someone can open instantly (it's built in, so it's free and works offline). */
export type ReadyTopic = { label: string; topic: string };

/** A group of ready-made paths. Student subjects also ask for a grade. */
export type ReadyCategory = { id: string; label: string; grades?: string[]; topics: ReadyTopic[] };

/**
 * The ready-made paths, grouped for the picker. Each `topic` is the text that selects the matching demo path
 * (see `getDemoPath`); for students it's prefixed with the grade, e.g. "Class 12 Physics".
 */
export const READY_CATEGORIES: ReadyCategory[] = [
  {
    id: "students",
    label: "🎓 Students (CBSE / NCERT)",
    grades: ["Class 11", "Class 12"],
    topics: [
      { label: "Maths", topic: "Maths" },
      { label: "Physics", topic: "Physics" },
      { label: "Chemistry", topic: "Chemistry" },
      { label: "Biology", topic: "Biology" },
      { label: "Computer Science", topic: "Computer Science" },
    ],
  },
  {
    id: "programming",
    label: "💻 Programming & AI",
    topics: [
      { label: "Python", topic: "Python" },
      { label: "Machine learning & AI", topic: "Machine learning" },
    ],
  },
  { id: "hobbies", label: "🎸 Hobbies", topics: [{ label: "Guitar", topic: "Guitar" }] },
  { id: "life", label: "🎤 Life skills", topics: [{ label: "Public speaking", topic: "Public speaking" }] },
];

/**
 * The topic text to request for a picked path.
 * @param {ReadyCategory} category The chosen category.
 * @param {ReadyTopic} topic The chosen topic.
 * @param {string} [grade] The chosen grade (students only).
 * @returns {string} e.g. "Class 12 Physics" or "Guitar".
 */
export function readyTopicText(category: ReadyCategory, topic: ReadyTopic, grade?: string): string {
  return category.grades && grade ? `${grade} ${topic.topic}` : topic.topic;
}
