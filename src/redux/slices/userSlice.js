import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: null,
    permissions: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserRoleAndPermissions: (state, action) => {
            const { role, permissions } = action.payload;
            state.role = role;
            state.permissions = permissions;

            // Store in localStorage
            localStorage.setItem("userRole", role);
            localStorage.setItem("userPermissions", JSON.stringify(permissions));
        },
        clearUserData: (state) => {
            state.role = null;
            state.permissions = null;
            localStorage.removeItem("userRole");
            localStorage.removeItem("userPermissions");
        },
        loadUserFromLocalStorage: (state) => {
            const storedRole = localStorage.getItem("userRole");
            const storedPermissions = localStorage.getItem("userPermissions");

            if (storedRole && storedPermissions) {
                state.role = storedRole;
                state.permissions = JSON.parse(storedPermissions);
            }
        },
    },
});

export const {
    setUserRoleAndPermissions,
    clearUserData,
    loadUserFromLocalStorage,
} = userSlice.actions;

export default userSlice.reducer;
