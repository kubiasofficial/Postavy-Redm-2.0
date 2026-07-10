module.exports = (req, res) => {
  res.setHeader("Set-Cookie", "crowe_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");
  res.redirect("/");
};
