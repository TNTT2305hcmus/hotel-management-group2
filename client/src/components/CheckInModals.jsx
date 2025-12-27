import { FaCheckCircle, FaQuestionCircle, FaTimesCircle } from 'react-icons/fa';

// Modal xác nhận check-in
export const ConfirmCheckInModal = ({
    reservation,
    onConfirm,
    onCancel,
    submitting
}) => {
    if (!reservation) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="checkin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">
                    <FaQuestionCircle size={60} color="#0f172a" />
                </div>
                <h3 className="modal-title">Confirm Check-in</h3>
                <p className="modal-message">
                    Confirm check-in for <b>{reservation.guestName}</b> into{' '}
                    <b>Room {reservation.roomNumber}</b>?
                </p>
                <div className="modal-actions">
                    <button
                        className="btn-modal-yes"
                        onClick={onConfirm}
                        disabled={submitting}
                    >
                        {submitting ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                        className="btn-modal-no"
                        onClick={onCancel}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal hiển thị trạng thái (thành công/thất bại)
export const StatusModal = ({
    isOpen,
    type,
    message,
    onClose
}) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`checkin-modal ${isSuccess ? 'success-theme' : 'error-theme'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`modal-icon ${type}-icon`}>
                    {isSuccess ? (
                        <FaCheckCircle size={60} />
                    ) : (
                        <FaTimesCircle size={60} />
                    )}
                </div>
                <h3 className={`modal-title ${type}-text`}>
                    {isSuccess ? 'Success!' : 'Failed'}
                </h3>
                <p className="modal-message">{message}</p>
                <button
                    className={`btn-modal-close btn-${type}`}
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
};
