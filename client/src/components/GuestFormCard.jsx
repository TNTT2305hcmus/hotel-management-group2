import { FaTrash } from 'react-icons/fa';

const GUEST_TYPES = [
    { id: 1, label: 'Domestic' },
    { id: 2, label: 'Foreign' }
];

const GuestFormCard = ({ guest, index, onGuestChange, onRemove, canRemove, maxGuests, guestCount }) => {
    const showWarning = maxGuests && guestCount > maxGuests;

    return (
        <div className={`guest-form-card ${showWarning ? 'warning' : ''}`}>
            <div className="guest-form-header">
                <span className="guest-number">Guest #{index + 1}</span>
                {canRemove && (
                    <button
                        className="btn-remove-guest"
                        onClick={onRemove}
                    >
                        <FaTrash />
                    </button>
                )}
            </div>

            {showWarning && (
                <div className="form-warning">
                    ⚠️ Number of guests exceeds room capacity ({maxGuests} max allowed)
                </div>
            )}

            <div className="guest-form-grid">
                <div className="form-group">
                    <label className="form-label">Name*</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter guest name"
                        value={guest.fullName}
                        onChange={(e) => onGuestChange('fullName', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Type Of Guest*</label>
                    <select
                        className="form-select"
                        value={guest.customerTypeId}
                        onChange={(e) => onGuestChange('customerTypeId', parseInt(e.target.value))}
                    >
                        <option value="">Choose guest type</option>
                        {GUEST_TYPES.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">ID/Passport Number*</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter ID/Passport number"
                        value={guest.citizenId}
                        onChange={(e) => onGuestChange('citizenId', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Address*</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter address"
                        value={guest.address}
                        onChange={(e) => onGuestChange('address', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-input"
                        placeholder="Enter phone number"
                        value={guest.phone}
                        onChange={(e) => onGuestChange('phone', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Notes</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Additional Notes (optional)"
                        value={guest.notes}
                        onChange={(e) => onGuestChange('notes', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default GuestFormCard;
