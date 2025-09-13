import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const assessments = [
    {
        id: "asm-1",
        title: "The French Revolution",
        date: "2023-10-28",
        score: 85,
        status: "Completed",
    },
    {
        id: "asm-2",
        title: "Introduction to Quantum Physics",
        date: "2023-10-25",
        score: 92,
        status: "Completed",
    },
    {
        id: "asm-3",
        title: "Calculus I: Derivatives",
        date: "2023-10-22",
        score: 78,
        status: "Completed",
    },
    {
        id: "asm-4",
        title: "Shakespeare's Hamlet Analysis",
        date: "2023-10-20",
        score: 95,
        status: "Completed",
    },
];

export default function AssessmentsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Assessments</h1>
                <p className="text-muted-foreground">
                    Track your progress and review your past assessments.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assessment History</CardTitle>
                    <CardDescription>
                        A record of all the assessments you&apos;ve taken.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assessments.map((assessment) => (
                                <TableRow key={assessment.id}>
                                    <TableCell className="font-medium">{assessment.title}</TableCell>
                                    <TableCell>{assessment.date}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={assessment.score > 80 ? "default" : "secondary"}>
                                            {assessment.score}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">{assessment.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
