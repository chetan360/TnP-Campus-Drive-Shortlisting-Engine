const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  passwordHash: String,
  passwordSalt: String,
});

userSchema.methods.setPassword = function (password) {
  this.passwordSalt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 310000, 32, "sha256")
    .toString("hex");
};

userSchema.methods.verifyPassword = function (password) {
  if (!this.passwordHash || !this.passwordSalt) return false;
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 310000, 32, "sha256")
    .toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(this.passwordHash, "hex"),
  );
};

module.exports = mongoose.model("User", userSchema);
