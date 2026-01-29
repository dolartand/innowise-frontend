import {useState, useEffect} from "react";
import {Row, Col, Card, Button} from "react-bootstrap";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.jsx";
import UserProfile from "../users/UserProfile.jsx";
import UserEditForm from "../users/UserEditForm.jsx";
import CardList from "../cards/CardList.jsx";
import CardAddForm from "../cards/CardAddForm.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import * as userService from "../../services/userService.js";
import * as cardService from "../../services/cardService.js";

const ProfilePage = () => {
    const {user} = useAuth();
    const [profile, setProfile] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.userId) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileData, cardsData] = await Promise.all([
                userService.getUserById(user.userId),
                cardService.getUserCards(user.userId)
            ]);
            setProfile(profileData);
            setCards(cardsData);
        } catch (error) {
            toast.error('Ошибка загрузки профиля');
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateProfile = async (formData) => {
        setSaving(true);
        try {
            const updated = await userService.updateUser(user.userId, formData);
            setProfile(updated);
            setShowEditModal(false);
            toast.success('Профиль обновлён');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка обновления профиля');
        } finally {
            setSaving(false);
        }
    }

    const handleAddCard = async (cardData) => {
        setSaving(true);
        try {
            const newCard = await cardService.addCard(user.userId, cardData);
            setCards(prev => [...prev, newCard]);
            setShowCardModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка добавления карты');
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Удалить эту карту?')) {
            return;
        }

        try {
            await cardService.deleteCard(cardId);
            setCards(prev => prev.filter(c => c.id !== cardId));
            toast.success('Карта удалена');
        } catch (error) {
            toast.error('Ошибка удаления карты');
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h2 className='mb-4'>Мой профиль</h2>

            <Row>
                <Col lg={6} className='mb-4'>
                    <UserProfile
                        user={profile}
                        onEdit={() => setShowEditModal(true)}
                    />
                </Col>

                <Col lg={6}>
                    <Card>
                        <Card.Header className='d-flex justify-content-between align-items-centers'>
                            <h5 className='mb-5'>Мои карты</h5>
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={() => setShowCardModal(true)}
                            >
                                + Добавить карту
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <CardList
                                cards={cards}
                                onDelete={handleDeleteCard}
                                canDelete={true}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <UserEditForm
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onSubmit={handleUpdateProfile}
                user={profile}
                loading={saving}
            />

            <CardAddForm
                show={showCardModal}
                onHide={() => setShowCardModal(false)}
                onSubmit={handleAddCard}
                loading={saving}
            />
        </div>
    );
}

export default ProfilePage;