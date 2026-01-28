import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');

        try {
            await register(formData);
            toast.success('Регистрация успешна!');
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || 'Ошибка регистрации';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <Card.Header className="text-center">
                    <h4>Регистрация</h4>
                </Card.Header>
                <Card.Body>
                    <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
                </Card.Body>
                <Card.Footer className="text-center">
                    <small>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </small>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default RegisterPage;