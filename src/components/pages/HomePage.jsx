import {useState, useEffect, use} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Badge, InputGroup, Card, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.jsx";
import ItemList from "../items/ItemList.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import Pagination from "../common/Pagination.jsx";
import * as ItemService from "../../services/itemService.js";

const HomePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState({});
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
       fetchItems()
    }, [currentPage]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await  ItemService.getAllItems({
                page: currentPage,
                size: 12
            });
            setItems(response.context || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            toast.error('Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchItems();
            return;
        }

        setLoading(true);
        try {
            const results = await ItemService.searchItems(searchQuery);
            setItems(results);
            setTotalPages(1);
            setCurrentPage(0);
        } catch (error) {
            toast.error('Ошибка поиска');
        } finally {
            setLoading(false);
        }
    }

    const addToCart = (item) => {
        if (!isAuthenticated) {
            toast.info('Войдите для добавления товаров в заказ');
            navigate('/login');
            return;
        }

        setCart(prev => ({
            ...prev,
            [item.id]: {
                quantity: (prev[item.id]?.quantity || 0) + 1
            }
        }));
        toast.success(`${item.name} добавлен в заказ`);
    }

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const newCart = {...prev};
            if (newCart[itemId]?.quantity > 1) {
                newCart[itemId].quantity -= 1;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
    }

    const clearCart = () => setCart({});

    const cartItemsCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleProceedToOrder = () => {
        navigate('/orders/create', {state: {cart}});
    }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
                <h2>Каталог товаров</h2>

                <Form onSubmit={handleSearch} className='d-flex' style={{maxWidth: '400px'}}>
                    <InputGroup>
                        <Form.Control
                            type='text'
                            placeholder='Поиск товаров...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type='submit' variant='outline-primary'>🔎</Button>
                    </InputGroup>
                </Form>
            </div>

            {cartItemsCount > 0 && (
                <Card className='mb-4 bg-light'>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div>
                                <Badge bg='primary' className='me-2 fs-6'>
                                    🗑️ {cartItemsCount} товаров
                                </Badge>
                                <span className='fw-bold fs-5'>{cartTotal.toFixed(2)} р.</span>
                            </div>
                            <div className='d-flex gap-2'>
                                <Button variant='outline-secondary' size='sm' onClick={clearCart}>
                                    Очистить
                                </Button>
                                <Button variant="success" onClick={handleProceedToOrder}>
                                    Оформить заказ
                                </Button>
                            </div>
                        </div>

                        <div className="mt-3">
                            {Object.values(cart).map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <span>{item.name} × {item.quantity}</span>
                                    <div>
                                        <span className="me-3">{(item.price * item.quantity).toFixed(2)} ₽</span>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            −
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            )}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <ItemList
                        items={items}
                        onAddToCart={addToCart()}
                        cartItems={cart}
                        />
                    <div className='mt-4'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default HomePage;