import { Row, Col, Alert } from 'react-bootstrap';
import ItemCard from './ItemCard';

const ItemList = ({ items, onAddToCart, cartItems = {} }) => {
    if (!items || items.length === 0) {
        return (
            <Alert variant="info">
                Товары не найдены
            </Alert>
        );
    }

    return (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {items.map(item => (
                <Col key={item.id}>
                    <ItemCard
                        item={item}
                        onAddToCart={onAddToCart}
                        cartQuantity={cartItems[item.id]?.quantity || 0}
                    />
                </Col>
            ))}
        </Row>
    );
}

export default ItemList;