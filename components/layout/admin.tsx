import Sidenav from "../Sidenav";
import routes from "../../constants/routes";

const AdminLayout = (props: any) => {
  const { children } = props;

  return (
    <section className="min-h-screen bg-blue-gray-50/50">
      <Sidenav brandImg="/img/logo-ct.png" brandName="" routes={routes} />
      <div className="p-4 xl:ml-80">
        {children}
      </div>
    </section>
  );
};

export default AdminLayout;
