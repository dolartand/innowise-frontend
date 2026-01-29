import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const statusVariants = {
    PENDING: 'warning',
    PROCESSING: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger'
};

const OrderDetails = ({ order, onStatusChange, onDelete }) => {
    const { isAdmin } = useAuth();

    if (!order) {
        return null;
    }

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Заказ #{order.id}</h5>
                <Badge bg={statusVariants[order.status] || 'secondary'} className="fs-6">
                    {order.status}
                </Badge>
            </Card.Header>
            <Card.Body>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <p><strong>Дата создания:</strong> {new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                        <p><strong>Пользователь:</strong> {order.user ? `${order.user.name} ${order.user.surname}` : `#${order.userId}`}</p>
                    </div>
                    <div className="col-md-6">
                        <p className="fs-4"><strong>Итого:</strong> {order.totalPrice?.toFixed(2)} р.</p>
                    </div>
                </div>

                <h6>Товары в заказе:</h6>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.items?.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.itemName || item.name}</td>
                            <td>{item.price?.toFixed(2)} р.</td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity).toFixed(2)} р.</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {isAdmin() && (
                    <div className="mt-4 d-flex gap-2">
                        <select
                            className="form-select w-auto"
                            value={order.status}
                            onChange={(e) => onStatusChange(e.target.value)}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <Button variant="danger" onClick={onDelete}>
                            Удалить заказ
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default OrderDetails;