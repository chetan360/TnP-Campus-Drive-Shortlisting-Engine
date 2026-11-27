const path = require("path");

// API navigations receive page data. Direct browser navigations receive the
// static React shell, which then loads the same data through React Router.
module.exports = function renderReact(res, page, data = {}) {
  const payload = {
    page,
    data,
    currentUser: res.locals.currentUser
      ? { username: res.locals.currentUser.username }
      : null,
    messages: res.locals.messages || {},
  };

  if (reqAcceptsJson(res.req)) return res.json(payload);

  return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
};

function reqAcceptsJson(req) {
  return req.get("Accept")?.includes("application/json");
}
