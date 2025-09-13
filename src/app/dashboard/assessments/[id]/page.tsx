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
import { getDocumentById } from "../../documents/page";


type Question = GenerateAssessmentQuestionsOutput['questions'][0];

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

  const document = getDocumentById(params.id);

  useEffect(() => {
    if (!document) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await generateAssessmentQuestions({ documentContent: document.content });
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
  }, [document, toast]);

  if (!document) {
      return (
          <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold font-headline">Document not found</h1>
              <p className="text-muted-foreground mt-4">
                  We couldn&apos;t find the document you were looking for.
              </p>
              <Button onClick={() => router.push('/dashboard/documents')} className="mt-6">Back to Documents</Button>
          </div>
      )
  }

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
        title: document.title,
        content: document.content,
        topic: document.topic,
    }];

    // In a real app, you'd fetch this from a database or API
    const sharedDocuments = [{
        documentId: 'doc-shared-1',
        title: 'Advanced Topics in ' + document.topic,
        content: 'Further analysis on advanced topics related to ' + document.title,
        topic: document.topic,
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
          <h1 className="text-3xl font-bold font-headline">Assessment: {document.title}</h1>
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
        <h1 className="text-3xl font-bold font-headline">Assessment: {document.title}</h1>
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
