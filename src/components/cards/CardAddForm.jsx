import {useState} from "react";
import {Modal, Form, Alert, Button, FormLabel} from "react-bootstrap";

const CardAddForm = ({show, onHide, onSubmit, loading}) => {
    const [formData, setFormData] = useState({
        number: '',
        holder: '',
        expiryDate: '',
        cvv: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target();
        setFormData(prev => ({...prev, [name]: value}));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join('-') : value;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.number.replace(/\D/g, '').length !== 16) {
            setError('Номер карты должен состоять из 16 цифр');
            return;
        }

        onSubmit(formData);
        setFormData({ number: '', holder: '', expiryDate: '', cvv: ''});
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить карту</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form.Group clDataassName='mb-3'>
                        <Form.Label>Номер карты</Form.Label>
                        <Form.Control
                            type='text'
                            name='number'
                            value={formData.number}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                number: formatCardNumber(e.target.value)
                            }))}
                            placeholder="1234-5678-9012-3456"
                            maxLength={19}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Имя владельца</Form.Label>
                        <Form.Control
                            type="text"
                            name="holder"
                            value={formData.holder}
                            onChange={handleChange}
                            placeholder="IVAN IVANOV"
                            style={{ textTransform: 'uppercase' }}
                            required
                        />
                    </Form.Group>

                    <div className='row'>
                        <div className='col-6'>
                            <Form.Group className='mb-3'>
                                <FormLabel>Срок действия</FormLabel>
                                <Form.Control
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className='col-6'>
                            <Form.Group className="mb-3">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    placeholder="***"
                                    maxLength={3}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={onHide}>
                        Отмена
                    </Button>
                    <Button variant='primary' type='submit' disabled={loading}>
                        {loading ? 'Сохранение...' : 'Добавить'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CardAddForm;