const asyncHandler = (fn) => {
    return async (key, payload) => {
        try {
            return await fn(key, payload);
        } catch (error) {
            throw error;
        }
    };
};

export default asyncHandler;
