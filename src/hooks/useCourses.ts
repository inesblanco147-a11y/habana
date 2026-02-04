import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, PastCourse, CourseModality, CourseAvailability } from "@/types/course";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      
      return data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        image: course.image || "",
        modality: course.modality as CourseModality,
        availability: course.availability as CourseAvailability,
        date: course.date,
        duration: course.duration,
        location: course.location,
        price: Number(course.price),
        instructor: course.instructor,
        objectives: course.objectives || [],
        includes: course.includes || [],
        maxParticipants: course.max_participants,
        currentParticipants: course.current_participants
      }));
    }
  });
};

export const usePastCourses = () => {
  return useQuery({
    queryKey: ["past-courses"],
    queryFn: async (): Promise<PastCourse[]> => {
      const { data, error } = await supabase
        .from("past_courses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      return data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        image: course.image || "",
        modality: course.modality as CourseModality,
        date: course.date,
        participants: course.participants,
        rating: Number(course.rating),
        testimonial: course.testimonial,
        testimonialAuthor: course.testimonial_author,
        instructor: course.instructor,
        galleryImages: course.gallery_images || []
      }));
    }
  });
};
