import { Table, Badge } from 'react-bootstrap';

const statusVariants = {
    PROCESSING: 'info',
    SUCCESS: 'success',
    FAILED: 'danger'
};

const PaymentList = ({ payments }) => {
    if (!payments || payments.length === 0) {
        return <p className="text-muted">Платежи не найдены</p>;
    }

    return (
        <Table responsive hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Заказ</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            {payments.map(payment => (
                <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>#{payment.orderId}</td>
                    <td>{payment.totalAmount?.toFixed(2)} р.</td>
                    <td>
                        <Badge bg={statusVariants[payment.status] || 'secondary'}>
                            {payment.status}
                        </Badge>
                    </td>
                    <td>{new Date(payment.timestamp).toLocaleString('ru-RU')}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default PaymentList;