import { Form, Row, Col, Button } from 'react-bootstrap';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderFilters = ({ filters, onChange, onReset }) => {
    const handleStatusChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange({ ...filters, statuses: selectedOptions });
    }

    return (
        <Form className="mb-4 p-3 bg-light rounded">
            <Row className="align-items-end">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Статус</Form.Label>
                        <Form.Select
                            multiple
                            value={filters.statuses || []}
                            onChange={handleStatusChange}
                            style={{ height: '100px' }}
                        >
                            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Дата от</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={filters.dateFrom || ''}
                            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Дата до</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={filters.dateTo || ''}
                            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Button variant="secondary" onClick={onReset} className="w-100">
                        Сбросить
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default OrderFilters;;