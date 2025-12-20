import '../css/StatusSummary.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatusSummary = ({ stats, isLoading = false }) => {
  return (
    <div className="summary-bar">
      <div className="card green">
        <span>Available</span>
        <i className='bx bx-bed'></i>
        <h3>{isLoading ? <Skeleton width={40} height={28} /> : stats.available}</h3>
      </div>

      <div className="card red">
        <span>Occupied</span>
        <i className='bx bx-user'></i>
        <h3>{isLoading ? <Skeleton width={40} height={28} /> : stats.occupied}</h3>
      </div>

      <div className="card yellow">
        <span>Maintenance</span>
        <i className='bx bx-recycle'></i>
        <h3>{isLoading ? <Skeleton width={40} height={28} /> : stats.maintenance}</h3>
      </div>
    </div>
  );
};

export default StatusSummary;
