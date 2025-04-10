
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse, deleteCourse } from "@/lib/api";
import { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import CourseForm from "@/components/CourseForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { ArrowLeft, Edit, Trash, Calendar, BookOpen } from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    setIsLoading(true);
    try {
      const data = await getCourseById(courseId);
      if (!data) {
        navigate("/courses", { replace: true });
        return;
      }
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      navigate("/courses", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = () => {
    setIsFormOpen(true);
  };

  const handleDeleteCourse = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleSubmitCourse = async (courseData: Course) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const updatedCourse = await updateCourse(id, courseData);
      setCourse(updatedCourse);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to update course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await deleteCourse(id);
      navigate("/courses", { replace: true });
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center h-96">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="container py-12 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-video overflow-hidden rounded-lg mb-4">
            <img
              src={course.image ||  import.meta.env.VITE_IMAGE}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant={course.available ? "default" : "secondary"}>
                {course.available ? "Available" : "Coming Soon"}
              </Badge>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleEditCourse} className="flex-1">
                <Edit className="mr-2 h-4 w-4" /> Edit Course
              </Button>
              <Button onClick={handleDeleteCourse} variant="destructive" className="flex-1">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          
          <div className="prose max-w-none mb-8">
            <p className="text-muted-foreground">{course.details}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
            <div className="flex items-center">
              <BookOpen className="text-muted-foreground mr-2 h-5 w-5" />
              <div>
                <h3 className="font-medium text-sm">Category</h3>
                <p>{course.category}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="text-muted-foreground mr-2 h-5 w-5" />
              <div>
                <h3 className="font-medium text-sm">Status</h3>
                <p>{course.available ? "Available" : "Coming Soon"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CourseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitCourse}
        initialData={course}
        isLoading={isSubmitting}
      />
      
      <DeleteConfirmation
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CourseDetails;
