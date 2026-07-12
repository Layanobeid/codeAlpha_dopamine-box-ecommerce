const userService = require("../services/user.service");
const catchAsync = require("../core/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

// GET ALL USERS (paginated)
const getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await userService.getUsers(page, limit);

  return ApiResponse.paginated(
    res,
    "Users fetched successfully",
    result.data,
    {
      page: Number(page),
      limit: Number(limit),
      total: result.total,
      pages: Math.ceil(result.total / limit),
    }
  );
});

// GET ONE USER
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return ApiResponse.success(
    res,
    "User fetched successfully",
    user
  );
});

// UPDATE USER
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return ApiResponse.success(
    res,
    "User updated successfully",
    user
  );
});

// DELETE USER
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);

  return ApiResponse.success(
    res,
    "User deleted successfully"
  );
});

// CREATE USER
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  return ApiResponse.success(
    res,
    "User created successfully",
    user,
    201
  );
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};