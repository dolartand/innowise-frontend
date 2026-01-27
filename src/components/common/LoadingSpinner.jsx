import { Spinner} from "react-bootstrap";

const LoadingSpinner = ({text='Загрузка'}) => {
    return (
      <div className="d-flex justify-content-center align-items-center">
          <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">{text}</p>
          </div>
      </div>
    );
}

export default LoadingSpinner;