import {Helmet} from 'react-helmet-async';
import {useTranslation} from 'react-i18next';
import {Navigate, Route, Routes} from 'react-router';
import {Layout} from './components/Layout';
import {PrivateRoute} from './components/PrivateRoute';
import {PublicRoute} from './components/PublicRoute';
import {Overview} from './pages/Overview';
import {SignIn} from './pages/SignIn';
import {SignUp} from './pages/SignUp';
import {TodoDetail} from './pages/TodoDetail';
import {TodoForm} from './pages/TodoForm';

function App() {
  const {i18n, t} = useTranslation();

  return (
    <>
      <Helmet
        titleTemplate={`%s - ${t('app.title')}`}
        defaultTitle={t('app.title')}
        htmlAttributes={{lang: i18n.language}}
      >
        <meta name="description" content={t('app.description')} />
      </Helmet>

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/todo/new" element={<TodoForm />} />
            <Route path="/todo/:id" element={<TodoDetail />} />
            <Route path="/todo/:id/edit" element={<TodoForm />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </>
  );
}

export default App;
