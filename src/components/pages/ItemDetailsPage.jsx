import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import * as itemService from '../../services/itemService.js';

const ItemDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        setLoading(true);
        try {
            const data = await itemService.getItemById(id);
            setItem(data);
        } catch (error) {
            toast.error('Ошибка загрузки товара');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info('Войдите для добавления товаров в заказ');
            navigate('/login');
            return;
        }

        toast.success(`${item.name} добавлен в заказ`);
        navigate('/');
    };

    if (loading) return <LoadingSpinner />;
    if (!item) return null;

    return (
        <div>
            <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/')}>
                ← Назад к каталогу
            </Button>

            <Card>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="mb-4">{item.name}</h2>

                            <div className="mb-4">
                                <h4 className="text-primary fw-bold">
                                    {item.price?.toFixed(2)} р.
                                </h4>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    Создан: {new Date(item.createdAt).toLocaleString('ru-RU')}
                                </small>
                            </div>

                            {item.updatedAt !== item.createdAt && (
                                <div className="mb-3">
                                    <small className="text-muted">
                                        Обновлен: {new Date(item.updatedAt).toLocaleString('ru-RU')}
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="col-md-4">
                            <Card className="bg-light">
                                <Card.Body>
                                    <h5 className="mb-3">Информация о товаре</h5>
                                    <div className="mb-3">
                                        <strong>ID:</strong> {item.id}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Цена:</strong> {item.price?.toFixed(2)} р.
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={handleAddToCart}
                                    >
                                        Добавить в заказ
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ItemDetailsPage;
