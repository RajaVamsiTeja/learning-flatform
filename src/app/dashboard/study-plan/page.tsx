'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, FileText, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { recommendStudyPlan, RecommendStudyPlanOutput } from "@/ai/flows/recommend-study-plan";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Recommendation = RecommendStudyPlanOutput['recommendedMaterials'][0];

export default function StudyPlanPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generatePlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedResults = localStorage.getItem('latestAssessmentResults');
        if (!storedResults) {
          setError("No assessment data found to generate a study plan.");
          setLoading(false);
          return;
        }

        const input = JSON.parse(storedResults);
        const result = await recommendStudyPlan(input);
        setRecommendations(result.recommendedMaterials);

      } catch (e) {
        console.error("Failed to generate study plan:", e);
        setError("Could not generate a study plan. Please try taking an assessment first.");
      } finally {
        setLoading(false);
      }
    };

    generatePlan();
  }, []);

  const renderLoading = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="animate-spin" />
          Generating Your Study Plan...
        </CardTitle>
        <CardDescription>
          Our AI is analyzing your assessment results to create a personalized plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );
  
  const renderError = () => (
    <Card className="text-center">
        <CardHeader>
            <CardTitle className="text-destructive">Generation Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={() => router.push('/dashboard/documents')}>Take an Assessment</Button>
        </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
     <Card className="text-center">
        <CardHeader>
            <CardTitle>Great Job!</CardTitle>
            <CardDescription>
                We don&apos;t have any specific recommendations for you at this time.
                You seem to have a good grasp of the material.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={() => router.push('/dashboard/documents')}>Explore More Documents</Button>
        </CardContent>
    </Card>
  )

  const renderRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target />
          Focus Areas
        </CardTitle>
        <CardDescription>
          These are the topics and materials we recommend you review to improve your score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {recommendations.map((rec, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                      {rec.documentId.includes('shared') ? <BookOpen /> : <FileText />}
                  </div>
                  <div>
                      <div className="text-left">{rec.title}</div>
                      <Badge variant="secondary" className="mt-1">{rec.topic}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-16">
                <p className="text-muted-foreground mb-4">{rec.reason}</p>
                <h4 className="font-semibold mb-2">Recommended Sections:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rec.sections.map((section, i) => (
                    <li key={i}>{section}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Personalized Study Plan</h1>
        <p className="text-muted-foreground">
          Based on your latest assessment, here are our AI-driven recommendations.
        </p>
      </div>
      
      {loading && renderLoading()}
      {!loading && error && renderError()}
      {!loading && !error && recommendations.length === 0 && renderEmptyState()}
      {!loading && !error && recommendations.length > 0 && renderRecommendations()}

    </div>
  );
}
