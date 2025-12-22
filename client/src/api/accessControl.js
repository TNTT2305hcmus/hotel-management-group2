// Chuẩn hoá tên role để tránh lệch chữ hoa/thường
const norm = (s) => (s ? String(s).trim().toUpperCase() : "");

const roleHierarchy = {
    MANAGER: ["RECEPTIONIST"],
    RECEPTIONIST: [],
};

export function expandRoles(accountTypeName) {
    const root = norm(accountTypeName);
    const set = new Set();
    const stack = root ? [root] : [];

    while (stack.length) {
        const r = stack.pop();
        if (set.has(r)) continue;
        set.add(r);

        const inherited = roleHierarchy[r] || [];
        for (const x of inherited) stack.push(norm(x));
    }
    return Array.from(set);
}

export function hasRole(user, allowedRoles = []) {
    const userRoles = expandRoles(user?.accountTypeName);
    return allowedRoles.map(norm).some((r) => userRoles.includes(r));
}
    