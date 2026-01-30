import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserList from '../../components/users/UserList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import * as userService from '../../services/userService';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        name: '',
        surname: '',
        active: ''
    });

    useEffect(() => {
        fetchUsers()
    }, [currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: 20,
                ...(filters.name && { name: filters.name }),
                ...(filters.surname && { surname: filters.surname }),
                ...(filters.active !== '' && { active: filters.active === 'true' })
            };

            const response = await userService.getAllUsers(params);
            setUsers(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            toast.error('Ошибка загрузки пользователей');
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchUsers();
    }

    const handleReset = () => {
        setFilters({ name: '', surname: '', active: '' });
        setCurrentPage(0);
    }

    useEffect(() => {
        if (filters.name === '' && filters.surname === '' && filters.active === '') {
            fetchUsers();
        }
    }, [filters]);

    const handleDeactivate = async (userId, isActive) => {
        try {
            await userService.changeUserActivity(userId, isActive);
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, active: isActive } : u
            ));
            toast.success(`Пользователь ${isActive ? 'активирован' : 'деактивирован'}`);
        } catch (error) {
            toast.error('Ошибка изменения статуса');
        }
    }

    const handleDelete = async (userId) => {
        if (!window.confirm('Удалить пользователя? Это действие необратимо.')) {
            return;
        }

        try {
            await userService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('Пользователь удалён');
        } catch (error) {
            toast.error('Ошибка удаления пользователя');
        }
    }

    return (
        <div>
            <h2 className="mb-4">Управление пользователями</h2>

            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <Row className="align-items-end">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={filters.name}
                                        onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Поиск по имени"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={filters.surname}
                                        onChange={(e) => setFilters(prev => ({ ...prev, surname: e.target.value }))}
                                        placeholder="Поиск по фамилии"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Статус</Form.Label>
                                    <Form.Select
                                        value={filters.active}
                                        onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value }))}
                                    >
                                        <option value="">Все</option>
                                        <option value="true">Активные</option>
                                        <option value="false">Неактивные</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary">Найти</Button>
                                    <Button variant="secondary" onClick={handleReset}>Сброс</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <UserList
                                users={users}
                                onDeactivate={handleDeactivate}
                                onDelete={handleDelete}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default UsersPage;