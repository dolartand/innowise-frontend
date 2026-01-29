import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import OrderDetails from '../../components/orders/OrderDetails';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as orderService from '../../services/orderService';
import * as paymentService from '../../services/paymentService';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails()
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const orderData = await orderService.getOrderById(id);
            setOrder(orderData);

            try {
                const paymentData = await paymentService.getPaymentByOrderId(id);
                setPayment(paymentData);
            } catch {;
                setPayment(null);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Заказ не найден');
            } else if (err.response?.status === 403) {
                setError('Нет доступа к этому заказу');
            } else {
                setError('Ошибка загрузки заказа');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (newStatus) => {
        try {
            const updated = await orderService.updateOrderStatus(id, newStatus);
            setOrder(updated);
            toast.success(`Статус изменён на ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка изменения статуса');
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            return;
        }

        try {
            await orderService.deleteOrder(id);
            toast.success('Заказ удалён');
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка удаления заказа');
        }
    }

    if (loading) {
        return <LoadingSpinner/>;;
    }

    if (error) {
        return (
            <Alert variant="danger">
                <h5>{error}</h5>
                <Button variant="outline-danger" onClick={() => navigate('/orders')}>
                    Вернуться к заказам
                </Button>
            </Alert>
        );
    }

    return (
        <div>
            <Button
                variant="outline-secondary"
                className="mb-3"
                onClick={() => navigate('/orders')}
            >
                ← Назад к заказам
            </Button>

            <OrderDetails
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />

            {/* Информация о платеже */}
            {payment && (
                <Card className="mt-4">
                    <Card.Header>
                        <h5 className="mb-0">Информация о платеже</h5>
                    </Card.Header>
                    <Card.Body>
                        <p><strong>ID платежа:</strong> {payment.id}</p>
                        <p>
                            <strong>Статус:</strong>{' '}
                            <Badge bg={payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'danger' : 'warning'}>
                                {payment.status}
                            </Badge>
                        </p>
                        <p><strong>Сумма:</strong> {payment.totalAmount?.toFixed(2)} ₽</p>
                        <p><strong>Дата:</strong> {new Date(payment.timestamp).toLocaleString('ru-RU')}</p>
                    </Card.Body>
                </Card>
            )}

            {!payment && order?.status === 'PENDING' && (
                <Alert variant="info" className="mt-4">
                    Платёж ещё не создан. Платежи создаются автоматически после создания заказа.
                </Alert>
            )}
        </div>
    );
}

export default OrderDetailsPage;