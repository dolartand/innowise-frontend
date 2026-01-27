import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const RegisterForm = ({ onSubmit, loading, error }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: ''
    });
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 8) {
            setValidationError('Пароль должен быть не менее 8 символов');
            return;
        }

        const { confirmPassword, ...submitData } = formData;
        onSubmit(submitData);
    }

    return (
        <Form onSubmit={handleSubmit}>
            {(error || validationError) && (
                <Alert variant="danger">{error || validationError}</Alert>
            )}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Введите имя"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Введите фамилию"
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Дата рождения</Form.Label>
                <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите email"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите пароль (мин. 8 символов)"
                    required
                    minLength={8}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Повторите пароль"
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </Form>
    )
}

export default RegisterForm;