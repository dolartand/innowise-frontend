import {ListGroup, Button, Badge} from "react-bootstrap";

const CardList = ({cards, onDelete, canDelete = false}) => {
    if (!cards || cards.length === 0) {
        return <p className="text-muted">Карты не добавлены</p>;
    }

    const maskCardNumber = (number) => {
        if (!number) {
            return '****';
        }

        const clean = number.replace(/\D/g, '');
        return `**** **** **** ${clean.slice(-4)}`;
    }

    return (
        <ListGroup>
            {cards.map(card => (
                <ListGroup.Item
                    key={card.id}
                    className="d-flex justify-content-between align-items-center"
                >
                    <div>
                        <span className="me-2">💳</span>
                        <strong>{maskCardNumber(card.number)}</strong>
                        <span className='text-muted ms-2'>({card.holder})</span>
                        {!card.active && <Badge bg="secondary" className="ms-2">Неактивна</Badge>}
                    </div>
                    {canDelete && (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(card.id)}
                        >
                            Удалить
                        </Button>
                    )}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default CardList;