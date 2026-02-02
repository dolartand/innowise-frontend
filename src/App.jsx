import {Routes, Route} from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";
import CreateOrderPage from "./components/pages/CreateOrderPage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import OrderDetailsPage from "./components/pages/OrderDetailsPage.jsx";
import OrdersPage from "./components/pages/OrdersPage.jsx";
import PaymentsPage from "./components/pages/PaymentsPage.jsx"
import ProfilePage from "./components/pages/ProfilePage.jsx";
import RegisterPage from "./components/pages/RegisterPage.jsx";
import UsersPage from "./components/pages/UsersPage.jsx";
import ItemsManagementPage from "./components/pages/ItemsManagementPage.jsx";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />

                <Route path="/profile" element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/orders" element={
                    <PrivateRoute>
                        <OrdersPage />
                    </PrivateRoute>
                } />
                <Route path="/orders/create" element={
                    <PrivateRoute>
                        <CreateOrderPage />
                    </PrivateRoute>
                } />
                <Route path="/orders/:id" element={
                    <PrivateRoute>
                        <OrderDetailsPage />
                    </PrivateRoute>
                } />
                <Route path="/payments" element={
                    <PrivateRoute>
                        <PaymentsPage />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />
                <Route path="/admin/users" element={
                    <AdminRoute>
                        <UsersPage />
                    </AdminRoute>
                } />
                <Route path="/admin/items" element={
                    <AdminRoute>
                        <ItemsManagementPage />
                    </AdminRoute>
                } />
            </Routes>
        </Layout>
    );
}

export default App;