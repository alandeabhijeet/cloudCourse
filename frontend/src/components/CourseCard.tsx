
import { Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
  isManageable?: boolean;
}

export function CourseCard({ course, onEdit, onDelete, isManageable = false }: CourseCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={course.image || "https://images.unsplash.com/photo-1487958449943-2429e8be8625"} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={course.available ? "default" : "secondary"}>
            {course.available ? "Available" : "Coming Soon"}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-xl line-clamp-2">{course.title}</h3>
          <Badge variant="outline">{course.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3">{course.details}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to={`/courses/${course.id}`}>
            <Info className="h-4 w-4 mr-2" /> Details
          </Link>
        </Button>
        
        {isManageable && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit && onEdit(course)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete && onDelete(course.id)}
              className="h-8 w-8 text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
