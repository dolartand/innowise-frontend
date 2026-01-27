import {useState} from "react";
import {Form, Button, Alert, FormGroup, FormControl} from "react-bootstrap";

const LoginForm = ({onSubmit, loading, error}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({email, password});
    }

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert> }

            <FormGroup className="mb-3" >
                <Form.Label>Email</Form.Label>
                <FormControl
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите email"
                    required
                />
            </FormGroup>

            <FormGroup className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <FormControl
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                />
            </FormGroup>

            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                {loading ? 'Вход...' : 'Войти'}
            </Button>
        </Form>
    );
}

export default LoginForm;