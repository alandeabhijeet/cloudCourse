
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Course {
  _id: string;
  title: string;
  details?: string;
  price?: number;
  image?: string;
  category?: string;
}

const Courses = () => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_ITEMS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCourses();
  }, [token]);

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyCourse = async (course: Course) => {
    if (!token) {
      alert('Please login to purchase courses');
      return;
    }
  
    if (!course?._id) {
      console.error('Invalid course:', course);
      alert('Invalid course selection');
      return;
    }
  
    setProcessingPayment(true);
  
    try {
      // 1. Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error('Payment gateway failed to load');
  
      // 2. Create order with shorter receipt
      const receipt = `crse_${Date.now()}`; // Shorter receipt format
      const { data: order } = await axios.post(
        import.meta.env.VITE_CREATE_ORDER,
        {
          amount: (course.price || 100) * 100,
          currency: 'INR',
          receipt: receipt, // Using shorter receipt
          courseId: course._id
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      // 3. Payment options
      const options = {
        key: import.meta.env.VITE_RAZERPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'E-Learning Platform',
        description: `Purchase: ${course.title?.substring(0, 30) || 'Course'}`,
        image:  import.meta.env.VITE_IMAGE,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const { data } = await axios.post(
              import.meta.env.VITE_ADD_BUY_COURSE,
              {
                courseId: course._id,
                paymentData: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  original_receipt: receipt // Include the receipt if needed
                }
              },
              { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                } 
              }
            );
            alert(data.message || 'Course purchased successfully!');
          } catch (error: any) {
            console.error('Payment verification error:', error.response?.data || error);
            alert(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => setProcessingPayment(false),
        }
      };
  
      // 4. Open payment modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        alert(`Payment failed: ${response.error.description}`);
        setProcessingPayment(false);
      });
      rzp.open();
  
    } catch (error: any) {
      console.error('Payment processing error:', error.response?.data || error);
      alert(error.response?.data?.error?.description || 
           error.response?.data?.message || 
           'Payment processing failed');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={course.image ||  import.meta.env.VITE_IMAGE}
              alt={course.title || 'Course image'}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =  import.meta.env.VITE_IMAGE;
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title || 'Untitled Course'}</h3>
              {course.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                  {course.category}
                </span>
              )}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.details || 'No description available'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{course.price || 1}</span>
                <button
                  onClick={() => handleBuyCourse(course)}
                  disabled={processingPayment}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    processingPayment
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {processingPayment ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses available currently</p>
        </div>
      )}
    </div>
  );
};

export default Courses;