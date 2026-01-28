import { Card, Button, Row, Col } from 'react-bootstrap';

const UserProfile = ({ user, onEdit }) => {
    if (!user) return null;

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Профиль</h5>
                <Button variant="primary" size="sm" onClick={onEdit}>
                    Редактировать
                </Button>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md='6'>
                        <p><strong>Имя:</strong> {user.name}</p>
                        <p><strong>Фамилия:</strong> {user.surname}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Дата рождения:</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString('ru-RU') : '-'}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default UserProfile;