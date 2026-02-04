import { Card, Button, Badge } from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const ItemCard = ({item, onAddToCart, cartQuantity = 0}) => {
    const navigate = useNavigate();

    return (
        <Card className="h-100" style={{cursor: 'pointer'}} onClick={() => navigate(`/items/${item.id}`)}>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3 fs-5 fw-bold">
                    {item.name}
                </Card.Title>

                <div className="mt-auto d-flex justify-content-between align-items-end">
                    <div>
                        <div className="text-primary fw-bold fs-4">
                            {item.price?.toFixed(2)} р.
                        </div>
                        {cartQuantity > 0 && (
                            <Badge bg="success" className="mt-1">
                                В корзине: {cartQuantity}
                            </Badge>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                        }}
                    >
                        Добавить в заказ
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ItemCard;
