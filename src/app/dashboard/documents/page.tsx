import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Upload, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documents = [
  {
    id: "doc-1",
    title: "Introduction to Quantum Physics",
    topic: "Physics",
    uploadedAt: "2023-10-01",
    wordCount: 10234,
    content: "Quantum physics is the study of matter and energy at the most fundamental level. It aims to uncover the properties and behaviors of the very building blocks of nature. While many quantum experiments examine very small objects, such as electrons and photons, quantum phenomena are all around us, acting on every scale."
  },
  {
    id: "doc-2",
    title: "The French Revolution",
    topic: "History",
    uploadedAt: "2023-10-05",
    wordCount: 8765,
    content: "The French Revolution was a period of far-reaching social and political upheaval in France and its colonies beginning in 1789. The Revolution overthrew the monarchy, established a republic, catalyzed violent periods of political turmoil, and finally culminated in a dictatorship under Napoleon who brought many of its principles to areas he conquered in Western Europe and beyond."
  },
  {
    id: "doc-3",
    title: "Calculus I: Derivatives",
    topic: "Mathematics",
    uploadedAt: "2023-10-12",
    wordCount: 15432,
    content: "The derivative of a function of a real variable measures the sensitivity to change of the function value (output value) with respect to a change in its argument (input value). Derivatives are a fundamental tool of calculus. For example, the derivative of the position of a moving object with respect to time is the object's velocity: this measures how quickly the position of the object changes when time is advanced."
  },
  {
    id: "doc-4",
    title: "Shakespeare's Hamlet Analysis",
    topic: "Literature",
    uploadedAt: "2023-10-18",
    wordCount: 6543,
    content: "The Tragedy of Hamlet, Prince of Denmark, often shortened to Hamlet, is a tragedy written by William Shakespeare sometime between 1599 and 1601. It is Shakespeare's longest play, with 29,551 words. Set in Denmark, the play depicts Prince Hamlet and his revenge against his uncle, Claudius, who has murdered Hamlet's father in order to seize his throne and marry Hamlet's mother."
  },
];

export function getDocumentById(id: string) {
    return documents.find(doc => doc.id === id);
}

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Documents</h1>
          <p className="text-muted-foreground">
            Manage your uploaded documents and start new assessments.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
          <CardDescription>
            A list of all your processed study documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.topic}</Badge>
                  </TableCell>
                  <TableCell>{doc.uploadedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/assessments/${doc.id}`}>Start Assessment</Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
