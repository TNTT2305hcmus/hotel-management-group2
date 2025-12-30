import '../css/FilterBar.css';

const FilterBar = ({ onSearch, onFilterType, onFilterStatus }) => {

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Search by room number..." 
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* Room Type Dropdown */}
      <select onChange={(e) => onFilterType(e.target.value)}>
        <option value="">All Room Types</option>
        <option value="1">Standard</option>
        <option value="2">VIP</option>
        <option value="3">Luxury</option>
      </select>

      {/* Status Dropdown */}
      <select onChange={(e) => onFilterStatus(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
        <option value="Maintenance">Maintenance</option>
      </select>
    </div>
  );
};

export default FilterBar;