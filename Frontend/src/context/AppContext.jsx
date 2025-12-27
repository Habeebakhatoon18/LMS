import { createContext, useState, useEffect } from "react";
export const  AppContext = createContext();
import { useNavigate } from "react-router-dom";
import { apiService } from "../assets/assests";

export const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

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

    // Mock courses for components that expect courses in context
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
    const [allCourses, setAllCourses] = useState(mockCourses);
    const [enrolledCourses, setEnrolledCourses] = useState(mockCourses);
    const value = {
        isEducator, navigate,
        faqs,
        isEnrolled,setIsEnrolled,
        allCourses,
        setAllCourses,
        setIsEducator,
        enrolledCourses, setEnrolledCourses
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}