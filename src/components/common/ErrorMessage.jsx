import { Alert } from "react-bootstrap";

const ErrorMessage = ({message, onClose}) => {
    if (!message) {
        return null;
    }

    return (
        <Alert variant="danger" dismissible={!!onClose} onClose={onClose}>
            {message}
        </Alert>
    );
}

export default ErrorMessage;