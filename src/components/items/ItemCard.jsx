import { Card, Button, Badge } from "react-bootstrap";

const ItemCard = ({item, onAddToCart, cartQuantity = 0}) => {
    return (
        <Card className="h-100 order-item-card">
            <Card.Body className="d-flex flexcolumn">
                <Card.Title>{item.name}</Card.Title>
                <Card.Text className="text-primary fw-bold fs-4">
                    {item.price?.toFixed(2)} р.
                </Card.Text>

                <div className="mt-auto">
                    {cartQuantity > 0 && (
                        <Badge bg="success" className="mb-2">
                            В корзине: {cartQuantity}
                        </Badge>
                    )}
                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => onAddToCart(item)}
                    >
                        Добавить в заказ
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ItemCard;