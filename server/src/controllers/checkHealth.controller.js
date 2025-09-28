import {asyncHandler, ApiResponse } from '../utility/index.js'


const checkHealth = asyncHandler(async (req, res) => {
    return res.json(new ApiResponse(200, 'Server is running hehehe!'));
})

export default checkHealth;