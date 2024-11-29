export interface Result {
  totalMarks: number;
  scoredMarks: number;
  grade: string;
  subjectId: number;
  studentId: number;
  feedback:string;
}

export interface StudentDetails {
  id: number;
  name: string;
  fatherName: string;
  rollNo: number;
  campus: string;
}

export interface ResultResponse {
  student: {
    id: number;
    name: string;
    fatherName: string;
    rollNo: number;
    campus: string;
  };
  results: {
    subjectId: number;
    subjectName: string;
    totalMarks: number;
    scoredMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  totalScoredMarks: number;
}
