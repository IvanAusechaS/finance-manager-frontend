import { useNavigate } from "react-router-dom";

export default function useRedirect() {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/register');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToHome = () => {
        navigate('/');
    };

    const  goToDashboard = () => {
        navigate('/dashboard');
    };

    const goToCalendar = () => {   
        navigate('/calendar');
    };

    return { goToRegister, goToLogin, goToHome ,goToCalendar, goToDashboard };
}
