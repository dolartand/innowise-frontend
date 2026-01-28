import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Card, Container} from "react-bootstrap";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.jsx";
import LoginForm from "../auth/LoginForm.jsx";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {login} = useAuth();
    const {navigate} = useNavigate();
    const {location} = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async ({email, password}) => {
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            toast.success('Вход выполнен успешно!');
            navigate(from, {replace: true});
        } catch (error) {
            const message = err.response?.data?.message || 'Ошибка входа. Проверьте email и пароль.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Header className="text-center">
                    <h4>Вход в систему</h4>
                </Card.Header>
                <Card.Body>
                    <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
                </Card.Body>
                <Card.Footer className="text-center">
                    <small>
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </small>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default LoginPage;