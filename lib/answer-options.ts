import type { Incident } from "./types";

type AnswerOptions = Pick<Incident, "incidentId" | "choices" | "correctAnswer">;

const targetAnswerIndex = (incidentId: string, choiceCount: number) => {
  const numericId = Number(incidentId.match(/\d+/)?.[0]);
  if (!Number.isFinite(numericId)) return 0;
  return numericId % choiceCount;
};

export const distributeCorrectAnswer = <T extends AnswerOptions>(incident: T): T => {
  if (incident.choices.length < 2) return incident;

  const currentCorrectChoice = incident.choices[incident.correctAnswer];
  if (!currentCorrectChoice) return incident;

  const nextCorrectAnswer = targetAnswerIndex(incident.incidentId, incident.choices.length);
  const remainingChoices = incident.choices.filter((_, index) => index !== incident.correctAnswer);
  const choices = [
    ...remainingChoices.slice(0, nextCorrectAnswer),
    currentCorrectChoice,
    ...remainingChoices.slice(nextCorrectAnswer),
  ];

  return {
    ...incident,
    choices,
    correctAnswer: nextCorrectAnswer,
  };
};
