import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardCheck, Percent, ArrowRight, BookOpen } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome back, Shadcn!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s a quick overview of your progress. Keep up the great work!
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Uploaded
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assessments Taken
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">What&apos;s Next?</CardTitle>
            <CardDescription>
              Your next step to learning mastery.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex">
            <div className="bg-primary/10 p-6 rounded-lg flex flex-col items-center justify-center h-full w-full text-center">
              <div className="mb-4 bg-primary/20 text-primary p-3 rounded-full">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review Study Plan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You just finished an assessment on "The French Revolution". Check out your personalized study plan!
              </p>
              <Button asChild>
                <Link href="/dashboard/study-plan">
                  View My Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Recent Assessment Scores</CardTitle>
            <CardDescription>
              Your performance over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
