import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function withRouter(Component: any) {
  return (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };
}