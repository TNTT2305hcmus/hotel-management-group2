import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputGroup = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    isPasswordField, 
    showPassword, 
    onTogglePassword,
    options = [],
    wrapperClass = "" // <--- Thêm prop này
}) => (
    // Thêm wrapperClass vào div form-group
    <div className={`form-group ${wrapperClass}`}>
        <label>{label}</label>
        <div style={{ position: 'relative', width: '100%' }}>
            
            {type === 'select' ? (
                <select
                    className="input-styled"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={{ width: '100%', cursor: 'pointer', appearance: 'none' }} // appearance: none để bỏ mũi tên mặc định xấu xí
                >
                    {options.map((opt, index) => (
                        <option key={index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <>
                    <input 
                        type={type} 
                        className="input-styled" 
                        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                        value={value} 
                        onChange={e => onChange(e.target.value)}
                        style={{ width: '100%', paddingRight: isPasswordField ? '45px' : '15px' }}
                    />
                    {isPasswordField && (
                        <div 
                            onClick={onTogglePassword}
                            style={{
                                position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                                cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    )}
                </>
            )}
            
            {/* Nếu là select, thêm mũi tên custom cho đẹp giống hình */}
            {type === 'select' && (
                <div style={{
                    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: '#6b7280'
                }}>
                    ▼
                </div>
            )}
            
        </div>
    </div>
);

export default InputGroup;