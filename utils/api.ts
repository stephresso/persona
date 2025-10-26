import { API_BASE_URL, API_ENDPOINTS } from '../constants/config';
import { Archetype, Career, Question } from '../types';

/**
 * Fetches quiz questions from the API
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.QUIZ}`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

/**
 * Submits quiz responses and gets archetype result
 */
export const submitQuizResponses = async (responses: string[]): Promise<{ archetype: Archetype }> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.QUIZ_RESULTS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ responses }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit quiz responses');
  }

  return response.json();
};

/**
 * Fetches career recommendations based on archetype
 */
export const fetchCareerRecommendations = async (
  archetypeId: string,
  companySize?: string
): Promise<{ recommendations: Career[] }> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAREER_RECOMMENDATIONS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ archetypeId, companySize }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch career recommendations');
  }

  return response.json();
};

/**
 * Fetches details for a specific career
 */
export const fetchCareerDetails = async (
  careerId: string,
  companySize?: string
): Promise<Career> => {
  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.CAREER_DETAILS(careerId)}`);
  if (companySize) {
    url.searchParams.append('companySize', companySize);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch career details');
  }

  return response.json();
};
