import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const recommendations = [
  {
    documentId: "doc-2",
    title: "The French Revolution",
    topic: "History",
    sections: ["Chapter 2: The Estates-General", "Chapter 4: The Reign of Terror"],
    reason: "You showed weakness in questions related to the causes and key phases of the revolution.",
  },
  {
    documentId: "doc-shared-1",
    title: "Causes of the French Revolution (Shared)",
    topic: "History",
    sections: ["Section 1: Economic Crisis", "Section 3: Enlightenment Ideas"],
    reason: "This shared document provides a more in-depth look at the economic and philosophical roots of the revolution, which corresponds to your incorrect answers.",
  },
  {
    documentId: "doc-2",
    title: "The French Revolution",
    topic: "History",
    sections: ["Chapter 5: The Rise of Napoleon"],
    reason: "Reviewing this section will help clarify the transition from the Directory to the Napoleonic era.",
  },
];

export default function StudyPlanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Personalized Study Plan</h1>
        <p className="text-muted-foreground">
          Based on your latest assessment, here are our AI-driven recommendations.
        </p>
      </div>

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
    </div>
  );
}
