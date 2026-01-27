import { Link, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button, NavDropdown} from "react-bootstrap";
import {useAuth} from "../../context/AuthContext.jsx";

const Navbar = () => {
    const {user, isAuthenticated, isAdmin, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }

    return (
        <BsNavbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <BsNavbar.Brand as={Link} to "/">
                    Online Shop
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="navbar-nav" />

                <BsNavbar.Collapse id="navbar nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Каталог</Nav.Link>

                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/orders">Мои заказы</Nav.Link>
                                <Nav.Link as={Link} to="/payments">Платежи</Nav.Link>
                            </>
                        )}

                        {isAuthenticated && isAdmin() && (
                            <NavDropdown title="Админ" id="admin-dropdown">
                                <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/users">Пользователи</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    <Nav>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/profile">
                                    👤 {user?.email}
                                </Nav.Link>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Войти</Nav.Link>
                                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}
