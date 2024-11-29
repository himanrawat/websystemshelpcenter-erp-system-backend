import { Result } from '../types/types';

// Validate result data for full updates
export const validateResultData = (result: Result): string | null => {
  if (typeof result.totalMarks !== 'number' || result.totalMarks <= 0) {
    return 'Total marks must be a positive number';
  }
  if (typeof result.scoredMarks !== 'number' || result.scoredMarks < 0) {
    return 'Scored marks must be a non-negative number';
  }
  if (typeof result.grade !== 'string' || result.grade.trim() === '') {
    return 'Grade must be a non-empty string';
  }
  if (typeof result.subjectId !== 'number' || result.subjectId <= 0) {
    return 'Subject ID must be a positive number';
  }
  if (typeof result.studentId !== 'number' || result.studentId <= 0) {
    return 'Student ID must be a positive number';
  }
  if (typeof result.feedback !== 'string' || result.subjectId <= 0) {
    return 'Subject ID must be a positive number';
  }
  return null;
};

// Validate result data for partial updates
export const validatePartialResultData = (result: Partial<Result>): string | null => {
  if (result.totalMarks !== undefined && (typeof result.totalMarks !== 'number' || result.totalMarks <= 0)) {
    return 'Total marks must be a positive number';
  }
  if (result.scoredMarks !== undefined && (typeof result.scoredMarks !== 'number' || result.scoredMarks < 0)) {
    return 'Scored marks must be a non-negative number';
  }
  if (result.grade !== undefined && (typeof result.grade !== 'string' || result.grade.trim() === '')) {
    return 'Grade must be a non-empty string';
  }
  if (result.subjectId !== undefined && (typeof result.subjectId !== 'number' || result.subjectId <= 0)) {
    return 'Subject ID must be a positive number';
  }
  if (result.studentId !== undefined && (typeof result.studentId !== 'number' || result.studentId <= 0)) {
    return 'Student ID must be a positive number';
  }
  return null;
};

