const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
    try {
    const token = req.cookies.adminSession;
    
    //if (token === null) return res.status(401).json({message: "Not Authorized"});
    if (!token) return res.redirect("/admin/login");
      console.log(token)
    jwt.verify(token, '12345', (err, user) => {
      //if (err) return res.status(401).json({message: "Not Authorized"});
      if (err) return res.redirect("/admin/login");
      
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
  };

module.exports = authenticateAdmin;