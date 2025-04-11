import { useLocation } from "react-router-dom";
import Dashboard from "../../Main/Dashboard";

export default function DashboardWrapper() {
    const location = useLocation();
    const { user, player } = location.state || {};

    return <Dashboard user={user} player={player} />;
}
