import {Table, Button, Badge} from "react-bootstrap";

const UserList = ({users, onDeactivate, onDelete}) => {
    if (!users || users.length === 0) {
        return <p className='text-muted'>Пользователи не найдены</p>;
    }

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name} {user.surname}</td>
                    <td>{user.email}</td>
                    <td>
                        <Badge bg={user.active ? 'success' : 'secondary'}>
                            {user.active ? 'Активен' : 'Неактивен'}
                        </Badge>
                    </td>
                    <td>
                        <Button
                            variant={user.active ? 'warning' : 'success'}
                            size="sm"
                            className="me-2"
                            onClick={() => onDeactivate(user.id, !user.active)}
                        >
                            {user.active ? 'Деактивировать' : 'Активировать'}
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(user.id)}
                        >
                            Удалить
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default UserList;