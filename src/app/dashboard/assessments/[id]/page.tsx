'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: "q1",
    question: "What is the primary cause of the French Revolution?",
    options: [
      "Economic hardship and inequality",
      "The rise of Napoleon Bonaparte",
      "The influence of the American Revolution",
      "Religious conflicts",
    ],
  },
  {
    id: "q2",
    question: "Which event marked the beginning of the French Revolution?",
    options: [
      "The Reign of Terror",
      "The execution of King Louis XVI",
      "The Storming of the Bastille",
      "The Tennis Court Oath",
    ],
  },
  {
    id: "q3",
    question: "Who was the leader of the Jacobins during the Reign of Terror?",
    options: [
      "Georges Danton",
      "Maximilien Robespierre",
      "Jean-Paul Marat",
      "Napoleon Bonaparte",
    ],
  },
  {
    id: "q4",
    question: "The Declaration of the Rights of Man and of the Citizen was inspired by which philosophical movement?",
    options: [
      "Romanticism",
      "The Enlightenment",
      "Existentialism",
      "Socialism",
    ],
  },
  {
    id: "q5",
    question: "What was the eventual outcome of the French Revolution for the monarchy?",
    options: [
      "It was replaced by a stable republic",
      "It was restored with limited powers",
      "It led to the rise of an empire under Napoleon",
      "It was abolished permanently",
    ],
  },
];


export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };

  const handleSubmit = () => {
    toast({
        title: "Assessment Submitted!",
        description: "Generating your personalized study plan...",
    });
    router.push("/dashboard/study-plan");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Assessment: The French Revolution</h1>
        <p className="text-muted-foreground">
          Test your knowledge based on the document you uploaded.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <RadioGroup onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)} value={answers[currentQuestion.id]}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted transition-colors">
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-opt${index}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-opt${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit Assessment</Button>
        )}
      </div>
    </div>
  );
}
