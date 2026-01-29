import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Card, Table, Button, Form, Alert, Row, Col} from "react-bootstrap";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.jsx";
import LoginSpinner from '../common/LoadingSpinner.jsx';
import * as itemService from '../../services/itemService.js';
import * as orderService from '../../services/orderService.js';
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const CreateOrderPage = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState(location.state?.cart || []);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchItems()
    }, []);

    const fetchItems = async () => {
        try {
            const response = await itemService.getAllItems({size: 100});
            setItems(response.content || []);
        } catch (error) {
            toast.error('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    }

    const updateQuantity = (itemId, quantity) => {
        const item = items.find(i => i.id === itemId);
        if (!item) {
            return;
        }

        setCart(prev => {
            if (quantity <= 0) {
                const newCart = {...prev};
                delete newCart[itemId];
                return newCart;
            }
            return {
                ...prev,
                [itemId]: {...item, quantity}
            };
        });

    }

    const cartTotal = Object.values(cart).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSubmit = async () => {
        if (Object.keys(cart).length === 0) {
            toast.error('Добавьте товары в заказ');
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                items: Object.values(cart).map(item => ({
                    itemId: item.id,
                    quantity: item.quantity
                }))
            };

            const order = await orderService.createOrder(orderData);
            toast.success('Заказ создан!');
            navigate(`/orders/${order.id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка создания заказа');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h2 className='mb-4'>Создание заказа</h2>

            <Row>
                <Col lg={8}>
                    <Card className='mb-4'>
                        <Card.Header>
                            <h5 className='mb-0'>Выберите товар</h5>
                        </Card.Header>
                        <Card.Body style={{maxHeight: '500px', overflowY: 'auto'}}>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Товар</th>
                                        <th>Цена</th>
                                        <th style={{width: '150px'}}>Количество</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price?.toFixed(2)} ₽</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={cart[item.id]?.quantity || 0}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="sticky-top" style={{ top: '80px' }}>
                        <Card.Header>
                            <h5 className="mb-0">Ваш заказ</h5>
                        </Card.Header>
                        <Card.Body>
                            {Object.keys(cart).length === 0 ? (
                                <Alert variant="info">Добавьте товары</Alert>
                            ) : (
                                <>
                                    {Object.values(cart).map(item => (
                                        <div key={item.id} className="d-flex justify-content-between mb-2">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>{(item.price * item.quantity).toFixed(2)} ₽</span>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold fs-5">
                                        <span>Итого:</span>
                                        <span>{cartTotal.toFixed(2)} ₽</span>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                variant="success"
                                className="w-100"
                                disabled={Object.keys(cart).length === 0 || submitting}
                                onClick={handleSubmit}
                            >
                                {submitting ? 'Оформление...' : 'Оформить заказ'}
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default CreateOrderPage;