import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Table, Badge, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as userService from '../../services/userService';
import * as orderService from '../../services/orderService';
import * as paymentService from '../../services/paymentService';

const statusVariants = {
    PENDING: 'warning',
    PROCESSING: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger'
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        usersCount: 0,
        ordersCount: 0,
        paymentsSummary: null
    });
    const [recentOrders, setRecentOrders] = useState([]);

    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 1)
        return d.toISOString().slice(0, 16)
    });
    const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 16));

    useEffect(() => {
        fetchDashboardData()
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [usersResponse, ordersResponse] = await Promise.all([
                userService.getAllUsers({ size: 1 }),
                orderService.getAllOrders({ size: 5, sort: 'createdAt,desc' })
            ]);

            setStats(prev => ({
                ...prev,
                usersCount: usersResponse.totalElements || 0,
                ordersCount: ordersResponse.totalElements || 0
            }));

            setRecentOrders(ordersResponse.content || []);

            await fetchPaymentStats();
        } catch (error) {
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }

    const fetchPaymentStats = async () => {
        try {
            const from = new Date(dateFrom).toISOString();
            const to = new Date(dateTo).toISOString();
            const summary = await paymentService.getGlobalPaymentSummary(from, to);
            setStats(prev => ({ ...prev, paymentsSummary: summary }));
        } catch (error) {
            console.error('Error fetching payment stats:', error);
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setRecentOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
            toast.success('Статус обновлён');
        } catch (error) {
            toast.error('Ошибка обновления статуса');
        }
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h2 className="mb-4">Панель администратора</h2>

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h6 className="text-muted">Пользователей</h6>
                            <p className="display-4 text-primary">{stats.usersCount}</p>
                            <Button as={Link} to="/admin/users" variant="outline-primary" size="sm">
                                Управление
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h6 className="text-muted">Заказов</h6>
                            <p className="display-4 text-success">{stats.ordersCount}</p>
                            <Button as={Link} to="/orders" variant="outline-success" size="sm">
                                Все заказы
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h6 className="text-muted">Платежей за период</h6>
                            <p className="display-4 text-info">
                                {stats.paymentsSummary?.paymentsCount || 0}
                            </p>
                            <p className="text-success fw-bold">
                                {stats.paymentsSummary?.totalAmount?.toFixed(2) || '0.00'} р.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h6 className="text-muted">Товары</h6>
                            <p className="display-4 text-warning">📦</p>
                            <Button as={Link} to="/admin/items" variant="outline-warning" size="sm">
                                Управление
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Период статистики платежей</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>От</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>До</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" onClick={fetchPaymentStats} className="w-100">
                                Обновить статистику
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Последние заказы</h5>
                    <Button as={Link} to="/orders" variant="outline-primary" size="sm">
                        Все заказы →
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Пользователь</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Изменить статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                                </td>
                                <td>{order.user?.name || `User #${order.userId}`}</td>
                                <td>{order.totalPrice?.toFixed(2)} р.</td>
                                <td>
                                    <Badge bg={statusVariants[order.status]}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        style={{ width: '150px' }}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AdminDashboard;