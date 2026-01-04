// Standardization to upper case
const norm = (s) => (s ? String(s).trim().toUpperCase() : "");

// Decentralize 
// MANAGER: ["RECEPTIONIST"] -> Manager is father -> Can do all work that receptionist can do
const roleHierarchy = {
    MANAGER: ["RECEPTIONIST"],
    RECEPTIONIST: [],
};

// From a single job title, all the rights that person holds can be inferred.
// Input is "RECEPTIONIST" -> Return ["RECEPTIONIST"]
// Input is "MANAGER" -> Return ["MANAGER", "RECEPTIONIST"]
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
    // Take all the rights of user
    const userRoles = expandRoles(user?.accountTypeName);
    // Check allowRoles is included in this list
    return allowedRoles.map(norm).some((r) => userRoles.includes(r));
}
    