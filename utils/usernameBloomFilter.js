const crypto = require("crypto");

class BloomFilter {
  constructor(size = 8192, hashCount = 4) {
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  _indexes(value) {
    const normalizedValue = String(value).trim().toLowerCase();
    const digest = crypto.createHash("sha256").update(normalizedValue).digest();
    const firstHash = digest.readUInt32BE(0);
    const secondHash = digest.readUInt32BE(4) || 1;

    return Array.from(
      { length: this.hashCount },
      (_, index) => (firstHash + index * secondHash) % this.size,
    );
  }

  add(value) {
    for (const index of this._indexes(value)) {
      this.bits[Math.floor(index / 8)] |= 1 << (index % 8);
    }
  }

  mightContain(value) {
    return this._indexes(value).every(
      (index) =>
        (this.bits[Math.floor(index / 8)] & (1 << (index % 8))) !== 0,
    );
  }
}

const usernameFilter = new BloomFilter();
let initializationPromise;

async function initializeUsernameFilter(User) {
  if (!initializationPromise) {
    initializationPromise = User.find({}, { username: 1, _id: 0 })
      .lean()
      .then((users) => {
        users.forEach(({ username }) => username && usernameFilter.add(username));
      })
      .catch((error) => {
        initializationPromise = undefined;
        throw error;
      });
  }

  return initializationPromise;
}

async function usernameExists(User, username) {
  const normalizedUsername = String(username).trim().toLowerCase();
  await initializeUsernameFilter(User);

  // A negative Bloom-filter result guarantees absence from the seeded set.
  if (!usernameFilter.mightContain(normalizedUsername)) return false;

  // Bloom filters can return false positives, so confirm possible matches.
  return Boolean(
    await User.exists({
      username: { $regex: `^${escapeRegExp(normalizedUsername)}$`, $options: "i" },
    }),
  );
}

function addUsername(username) {
  usernameFilter.add(username);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  BloomFilter,
  addUsername,
  initializeUsernameFilter,
  usernameExists,
};
