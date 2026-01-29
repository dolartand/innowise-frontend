import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.jsx";
import OrderList from "../orders/OrderList.jsx";
import OrderFilters from "../orders/OrderFilters.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import Pagination from "../common/Pagination.jsx";
import * as orderService from '../../services/orderService.js';

const OrdersPage = () => {
    const {user, isAdmin} = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        statuses: [],
        dateFrom: '',
        dateTo: ''
    });

    useEffect(() => {
        fetchOrders();
    }, [currentPage, user]);

    const fetchOrders = async () => {
        if (!user?.userId) {
            return;
        }

        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: 10,
                ...buildFilterParams()
            };
            let response;
            if (isAdmin) {
                response = await orderService.getAllOrders(params);
            } else {
                response = await orderService.getOrdersByUserId(user.userId, params);
            }

            setOrders(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            toast.error('Ошибка загрузки заказов');
        } finally {
            setLoading(false);
        }
    }

    const buildFilterParams = () => {
        const params = {};
        if (filters.statuses?.length > 0) {
            params.statuses = filters.statuses.join(',');
        }

        if (filters.dateFrom) {
            params.dateFrom = new Date(filters.dateFrom).toISOString();
        }

        if (filters.dateTo) {
            params.dateTo = new Date(filters.dateTo).toISOString();
        }
        return params;
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0);
    }

    const handleResetFilters = () => {
        setFilters({ statuses: [], dateFrom: '', dateTo: ''});
        setCurrentPage(0);
    }

    useEffect(() => {
        fetchOrders()
    }, [filters]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isAdmin() ? 'Все заказы' : 'Мои заказы'}</h2>
                <Button as={Link} to="/orders/create" variant="success">
                    + Новый заказ
                </Button>
            </div>

            {isAdmin() && (
                <OrderFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleResetFilters}
                />
            )}

            <Card>
                <Card.Body>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <OrderList orders={orders} showUser={isAdmin()} />
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

export default OrdersPage;