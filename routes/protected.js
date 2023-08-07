const express=require("express");
const {verifyToken}=require("../middleware/verifyToken");

const router = express.Router();

// Protected route that requires authentication
router.get("/me", verifyToken, (req, res) => {
    // Access the authenticated user's information using req.user
    res.status(200).json(req.user);
  });
  
  module.exports = router;