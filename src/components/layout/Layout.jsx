import Navbar from './Navbar';
import {Container} from "react-bootstrap";

const Layout = ({children}) => {
    return (
      <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Container className="flex-grow-1 py-4">
              {children}
          </Container>
          <footer className="bg-light py-3 mt-auto">
              <Container className="text-center text-muted">
                  <small>Innowise Internship</small>
              </Container>
          </footer>
      </div>
    );
}

export default Layout;