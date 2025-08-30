import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, NotFoundPage, UserPage } from '../pages/public';
import { PublicRoute } from './PublicRouter';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { PerfilPage, TasksPage, UsuariosPage } from '../pages/private';


export const AppRouter = () => {
  return (
    <HashRouter>
    {/* <BrowserRouter> */}
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="./login" />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/userRegister" element={<UserPage />}></Route>
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    {/* </BrowserRouter> */}
    </HashRouter>
  );
};
