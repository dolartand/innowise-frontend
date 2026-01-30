import {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Card, Button, Form, Row, Col} from "react-bootstrap";
import {toast} from "react-toastify";
import PaymentList from "../payments/PaymentList.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import Pagination from "../common/Pagination.jsx";
import * as paymentService from '../../services/paymentService.js';

const PaymentsPage = () => {
    const {user, isAdmin} = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [summary, setSummary] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        fetchPayments()
    }, [currentPage, user]);

    const fetchPayment = async () => {
        if (!user?.userId) {
            return null;
        }

        setLoading(true);
        try {
            const response = await paymentService.getPaymentsByUserIdPaged(user.userId, {
                page: currentPage,
                size: 10
            });
            setPayments(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            toast.error('Ошибка загрузки платежей');
        } finally {
            setLoading(false);
        }
    }

    const fetchSummary = async () => {
        if (!dateFrom || !dateTo) {
            toast.error('Укажите период');
            return;
        }

        try {
            const from = new Date(dateFrom).toISOString();
            const to = new Date(dateTo).toISOString();

            let summaryData;
            if (isAdmin()) {
                summaryData = await paymentService.getGlobalPaymentSummary(from, to);
            } else {
                summaryData = await paymentService.getUserPaymentSummary(user.userId, from, to);
            }
            setSummary(summaryData);
        } catch (error) {
            toast.error('Ошибка получения статистики');
        }
    }

    return (
        <div>
            <h2 className="mb-4">Платежи</h2>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Статистика платежей</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="align-items-end mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Дата от</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Дата до</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" onClick={fetchSummary} className="w-100">
                                Получить статистику
                            </Button>
                        </Col>
                    </Row>

                    {summary && (
                        <div className="p-3 bg-light rounded">
                            <Row>
                                <Col md={4}>
                                    <h6>Общая сумма</h6>
                                    <p className="fs-4 fw-bold text-success">
                                        {summary.totalAmount?.toFixed(2)} р.
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <h6>Количество платежей</h6>
                                    <p className="fs-4 fw-bold">{summary.paymentsCount}</p>
                                </Col>
                                <Col md={4}>
                                    <h6>Период</h6>
                                    <p>
                                        {new Date(summary.fromDate).toLocaleDateString('ru-RU')} – {' '}
                                        {new Date(summary.toDate).toLocaleDateString('ru-RU')}
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <h5 className="mb-0">История платежей</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <PaymentList payments={payments} />
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

export default PaymentsPage;