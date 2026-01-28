import {Table, Badge, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const statusVariants = {
    PENDING: 'warning',
    PROCESSING: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELED: 'danger'
};

const statusLabels = {
    PENDING: 'Ожидает оплаты',
    PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELED: 'Отменен'
}

const OrderList = ({orders, showUser = false}) => {
    if (!orders || orders.length === 0) {
        return <p className="text-muted">Заказы не найдены</p>;
    }

    return (
        <Table responsive hover>
            <thead>
                <tr>
                    <th>№ Заказа</th>
                    {showUser && <th>Пользователь</th>}
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
            {orders.map(order => (
                <tr key={order.id}>
                    <td>#{order.id}</td>
                    {showUser && (
                        <td>
                            {order.user ? `${order.user.name} ${order.user.surname}` : `User #${order.userId}`}
                        </td>
                    )}
                    <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td>{order.totalPrice?.toFixed(2)} р.</td>
                    <td>
                        <Badge bg={statusVariants[order.status] || 'secondary'}>
                            {statusLabels[order.status] || order.status}
                        </Badge>
                    </td>
                    <td>
                        <Button
                            as={Link}
                            to={`orders/${order.id}`}
                            variant="outline-primary"
                            size="sm"
                        >
                            Подробнее
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default OrderList;