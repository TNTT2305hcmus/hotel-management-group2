export const validatePassword = (pwd) => {
    // if (!pwd || pwd.length < 8) {
    //   return "Password must be at least 8 characters long.";
    // }
    // if (!/[A-Z]/.test(pwd)) {
    //   return "Password must contain at least one uppercase letter (A-Z).";
    // }
    // if (!/[a-z]/.test(pwd)) {
    //   return "Password must contain at least one lowercase letter (a-z).";
    // }
    // if (!/[0-9]/.test(pwd)) {
    //   return "Password must contain at least one number (0-9).";
    // }
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
    //   return "Password must contain at least one special character (!@#$...).";
    // }
    return null; // Không có lỗi
};

export const validateEmail = (email) => {
    // Tiện tay viết luôn sau này dùng
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : "Invalid email address.";
};