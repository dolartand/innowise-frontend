import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button, Table, Modal, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import * as itemService from '../../services/itemService';

const ItemsManagementPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: ''
    });

    useEffect(() => {
        fetchItems();
    }, [currentPage]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await itemService.getAllItems({
                page: currentPage,
                size: 20
            });
            setItems(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            toast.error('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price,
                stockQuantity: item.stockQuantity
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stockQuantity: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stockQuantity: parseInt(formData.stockQuantity)
        };

        try {
            if (editingItem) {
                await itemService.updateItem(editingItem.id, itemData);
                toast.success('Товар обновлён');
                setItems(prev => prev.map(item =>
                    item.id === editingItem.id ? { ...item, ...itemData } : item
                ));
            } else {
                const newItem = await itemService.createItem(itemData);
                toast.success('Товар создан');
                setItems(prev => [newItem, ...prev]);
            }
            handleCloseModal();
        } catch (error) {
            toast.error(editingItem ? 'Ошибка обновления товара' : 'Ошибка создания товара');
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Удалить товар? Это действие необратимо.')) {
            return;
        }

        try {
            await itemService.deleteItem(itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
            toast.success('Товар удалён');
        } catch (error) {
            toast.error('Ошибка удаления товара');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Управление товарами</h2>
                <Button variant="success" onClick={() => handleOpenModal()}>
                    + Добавить товар
                </Button>
            </div>

            <Card>
                <Card.Body>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Table responsive hover>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Описание</th>
                                    <th>Цена</th>
                                    <th>Остаток</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description || '-'}</td>
                                        <td>{item.price?.toFixed(2)} р.</td>
                                        <td>
                                            <Badge bg={item.stockQuantity > 0 ? 'success' : 'danger'}>
                                                {item.stockQuantity}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    Изменить
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Удалить
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingItem ? 'Редактировать товар' : 'Добавить товар'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Название *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Цена *</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Количество на складе *</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Отмена
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingItem ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ItemsManagementPage;
