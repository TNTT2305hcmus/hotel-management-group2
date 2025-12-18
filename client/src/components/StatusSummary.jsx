import '../css/StatusSummary.css';


const StatusSummary = ({ stats }) => {
  return (
    <div className="summary-bar">
      <div className="card green">
        <span>Available</span>
        <i className='bx  bx-bed'></i> 
        <h3>{stats.available}</h3>
      </div>
      <div className="card red">
        <span>Occupied</span>
        <i className='bx  bx-user'></i> 
        <h3>{stats.occupied}</h3>
      </div>
      <div className="card yellow">
        <span>Maintenance</span>
        <i className='bx  bx-recycle'></i> 
        <h3>{stats.maintenance}</h3>
      </div>
    </div>
  );
};

export default StatusSummary;