
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Book, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  "Browse a wide selection of educational courses",
  "Create and manage your own course catalog",
  "Track course availability and details",
  "Beautiful, responsive interface",
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Manage Your Courses With Ease
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                    Create, edit, delete, and list all your courses in one place.
                    A beautiful interface to manage your educational content.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    className="bg-white text-brand-800 hover:bg-gray-100"
                    onClick={() => navigate(isAuthenticated ? "/courses" : "/signup")}
                  >
                    {isAuthenticated ? "View Courses" : "SignUp"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-square md:aspect-video overflow-hidden rounded-xl bg-white/10 p-4 shadow-lg">
                  <Book className="absolute h-3/4 w-3/4 text-white/30 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Course Management
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides everything you need to manage your courses efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mt-12">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-4 rounded-lg border p-6 shadow-sm"
                >
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? "/courses" : "/signup")}
              >
                {isAuthenticated ? "Manage Your Courses" : "Sign In Now"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
