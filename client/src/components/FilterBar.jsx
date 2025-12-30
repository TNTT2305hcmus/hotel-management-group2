import '../css/FilterBar.css';


const FilterBar = ({ onSearch, onFilterType, onFilterStatus }) => {

  return (
    <div className="filter-bar">
      {/* Ô tìm kiếm */}
      <input 
        type="text" 
        placeholder="Search by room number..." 
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* Dropdown Loại phòng */}
      <select onChange={(e) => onFilterType(e.target.value)}>
        <option value="">All Room Types</option>
        <option value="1">Single</option>
        <option value="2">Double</option>
        <option value="3">Luxury</option>
      </select>

      {/* Dropdown Trạng thái */}
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