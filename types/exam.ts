export interface MCQOption {
  label: "i" | "ii" | "iii" | "iv";
  text: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: MCQOption[];
  optionCount: 3 | 4;
  layout: "vertical" | "horizontal";
}

export interface ExamHeader {
  title: string;
  subtitle: string;
  duration: string;
  totalMarks: number;
  grade: string;
  subject: string;
  logoUrl: string | null;
}

export interface ExamTypography {
  questionSize: number;  // px, default 13
  optionSize:   number;  // px, default 11
}

export interface ExamData {
  header:     ExamHeader;
  questions:  ExamQuestion[];
  typography: ExamTypography;
}

export const DEFAULT_EXAM: ExamData = {
  header: {
    title:      "Examination Paper",
    subtitle:   "1st Term",
    duration:   "45",
    totalMarks: 45,
    grade:      "Grade ___",
    subject:    "",
    logoUrl:    null,
  },
  questions:  [],
  typography: { questionSize: 13, optionSize: 11 },
};

export function newQuestion(): ExamQuestion {
  return {
    id:          crypto.randomUUID(),
    text:        "",
    optionCount: 3,
    layout:      "vertical",
    options:     (["i", "ii", "iii", "iv"] as MCQOption["label"][]).map(label => ({ label, text: "" })),
  };
}
