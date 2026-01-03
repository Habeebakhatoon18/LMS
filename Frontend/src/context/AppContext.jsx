import { createContext, useState, useEffect } from "react";
export const AppContext = createContext();
import { useNavigate } from "react-router-dom";
import { apiService } from "../assets/assests";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContextProvider = (props) => {
    const mockCourses = [
        {
            id: 'c1',
            title: 'Data Science and Machine Learning',
            shortDescription: 'Unlock the Power of Data',
            description: 'This course provides a comprehensive introduction to data science and machine learning. You will learn how to analyze data, build predictive models, and apply machine learning techniques to real-world problems.',
            rating: 4.6,
            reviews: 34,
            students: 120,
            levels: 2,
            videos: 4,
            duration: '49 hours, 30 minutes',
            image: '/src/assets/logo.png',
            price: '62.99',
            discount: 30,
            highlights: ['Lifetime access with free updates', 'Hands-on projects', 'Downloadable resources'],
            sections: [
                { id: 's1', title: 'Introduction to Data Science', totalDuration: '22 hours', lessons: [{ id: 'l1', title: 'Overview', duration: '10m' }, { id: 'l2', title: 'Setup', duration: '15m' }] },
                { id: 's2', title: 'Machine Learning Basics', totalDuration: '27 hours, 30 minutes', lessons: [{ id: 'l3', title: 'Regression', duration: '30m' }, { id: 'l4', title: 'Classification', duration: '40m' }] },
            ],
        }
    ];

    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState(mockCourses);
    const { getToken } = useAuth();
    const { user } = useUser();
    const currency = import.meta.env.VITE_CURRENCY
    const backendURL = import.meta.env.VITE_BACKEND_URL;


    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }


    const fetctAllCourses = async () => {
        try {
            const { data } = await axios.get(backendURL + '/courses/all');
            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const fetchUserEnrolledCourses = async () => {
        try {

            const token = await getToken();
            const { data } = await axios.get(backendURL + '/user/enrolled-courses', {
                headers:
                    { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator')
            setIsEducator(true);

        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendURL}/user/data`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    useEffect(() => {
        fetctAllCourses();
        fetchUserEnrolledCourses();
    }, []);

    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await apiService.getFAQs();
                if (mounted) setFaqs(res || []);
            } catch (err) {
                if (mounted) setFaqs([]);
            }
        })();
        return () => { mounted = false };
    }, []);

    const value = {
        isEducator, setIsEducator,
        allCourses, setAllCourses,
        enrolledCourses, setEnrolledCourses, fetchUserEnrolledCourses,
        backendURL, getToken, navigate, faqs,
        userData, fetchUserData
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}