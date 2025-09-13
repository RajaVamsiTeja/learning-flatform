'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { generateAssessmentQuestions, GenerateAssessmentQuestionsOutput } from "@/ai/flows/generate-assessment-questions";
import { Skeleton } from "@/components/ui/skeleton";

// Sample document about the French Revolution
const documentContent = `The French Revolution was a period of far-reaching social and political upheaval in France and its colonies beginning in 1789. The Revolution overthrew the monarchy, established a republic, catalyzed violent periods of political turmoil, and finally culminated in a dictatorship under Napoleon who brought many of its principles to areas he conquered in Western Europe and beyond. Inspired by liberal and radical ideas, the Revolution profoundly altered the course of modern history, triggering the global decline of absolute monarchies while replacing them with republics and liberal democracies.

Key events included the Storming of the Bastille on July 14, 1789, which is still celebrated in France as a national holiday. The Declaration of the Rights of Man and of the Citizen, adopted in August 1789, was a fundamental document of the Revolution, inspired by Enlightenment philosophy. It proclaimed that all men are born and remain free and equal in rights.

The Reign of Terror, from 1793 to 1794, was a dark chapter. The Committee of Public Safety, led by Maximilien Robespierre, executed thousands for 'crimes against the revolution.' The period ended with Robespierre's own execution.

The Directory, an executive committee of five, governed France from 1795 to 1799. It was a time of financial crisis and political instability, which paved the way for Napoleon Bonaparte's rise to power.`;


type Question = GenerateAssessmentQuestionsOutput['questions'][0];

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await generateAssessmentQuestions({ documentContent });
        setQuestions(result.questions);
      } catch (error) {
        console.error("Failed to generate questions:", error);
        toast({
          title: "Error",
          description: "Could not generate assessment questions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [toast]);


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
    const results = questions.map(q => ({
        questionId: q.id,
        isCorrect: answers[q.id] === q.answer,
        topic: q.topic,
    }));

    const uploadedDocuments = [{
        documentId: params.id,
        title: "The French Revolution",
        content: documentContent,
        topic: "History",
    }];

    // In a real app, you'd fetch this from a database or API
    const sharedDocuments = [{
        documentId: 'doc-shared-1',
        title: 'Causes of the French Revolution (Shared)',
        content: 'Further analysis on the economic and philosophical roots of the revolution.',
        topic: 'History',
        difficulty: 'Intermediate'
    }];
    
    localStorage.setItem('latestAssessmentResults', JSON.stringify({
        assessmentResults: results,
        uploadedDocuments,
        sharedDocuments,
    }));

    toast({
        title: "Assessment Submitted!",
        description: "Generating your personalized study plan...",
    });

    router.push("/dashboard/study-plan");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Assessment: The French Revolution</h1>
          <p className="text-muted-foreground">
            Generating questions based on the document you uploaded...
          </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questions.length) {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold font-headline">Assessment Generation Failed</h1>
            <p className="text-muted-foreground mt-4">
                We couldn&apos;t generate questions for this document. Please try another one.
            </p>
            <Button onClick={() => router.push('/dashboard/documents')} className="mt-6">Back to Documents</Button>
        </div>
    )
  }

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
          <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>Submit Assessment</Button>
        )}
      </div>
    </div>
  );
}
