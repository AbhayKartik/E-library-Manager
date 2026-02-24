require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const foundUser = async (username, email, contact) => {
  try {
    const sql = `
      SELECT username FROM users WHERE username = ? OR email = ? OR contact = ?
      UNION
      SELECT username FROM admin WHERE username = ? OR email = ? OR contact = ?
    `;
    let [result] = await connection.query(sql, [
      username,
      email,
      contact,
      username,
      email,
      contact,
    ]);

    return result.length > 0;
  } catch (error) {
    console.error("Error set Fine:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  const deleteUserSQL = "DELETE FROM users WHERE id = ?";
  const deleteAdminSQL = "DELETE FROM admin WHERE id = ?";

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const [res1] = await conn.query(deleteUserSQL, [id]);
    const [res2] = await conn.query(deleteAdminSQL, [id]);

    await conn.commit();

    return res1.affectedRows + res2.affectedRows;
  } catch (error) {
    await conn.rollback();
    console.error("Delete user failed:", error);
    throw error;
  } finally {
    conn.release();
  }
};

const findUser = async (id) => {
  const findUserSQL = "SELECT * FROM users WHERE id = ?";
  const findAdminSQL = "SELECT * FROM admin WHERE id = ?";

  try {
    const [userRows] = await connection.query(findUserSQL, [id]);

    if (userRows.length > 0) {
      return userRows;
    }

    const [adminRows] = await connection.query(findAdminSQL, [id]);

    if (adminRows.length > 0) {
      return adminRows;
    }
    console.log(userRows, adminRows);
    return null;
  } catch (error) {
    console.error("Find user error:", error);
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  try {
    let sql = `SELECT
    u.id AS user_id,
    u.username,
    u.email,
    u.contact,

    COALESCE(pi.issued_count, 0)   AS issued_count,
    COALESCE(pi.pending_count, 0)  AS pending_count,
    COALESCE(pi.rejected_count, 0) AS rejected_count,

    COALESCE(ir.returned_count, 0) AS returned_count,
    COALESCE(ir.total_fine, 0)     AS total_fine

FROM users u

LEFT JOIN (
    SELECT
        MemberID,
        COUNT(CASE WHEN status = 'issued' THEN 1 END)  AS issued_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END)  AS rejected_count
    FROM pendingissue
    GROUP BY MemberID
) pi
    ON u.id = pi.MemberID

LEFT JOIN (
    SELECT
        MemberID,
        COUNT(CASE WHEN ReturnDate IS NOT NULL THEN 1 END) AS returned_count,
        SUM(
            CASE 
                WHEN ReturnDate IS NOT NULL THEN Fine 
                ELSE 0 
            END
        ) AS total_fine
    FROM issuerecord
    GROUP BY MemberID
) ir
    ON u.id = ir.MemberID;
`;
    let [result] = await connection.query(sql);
    res.json(result);
  } catch (error) {
    console.error("ERROR in Fetching", error.message);
    res.status(500).send("Server Error");
  }
};

const getAllAdmin = async (req, res) => {
  try {
    let sql = ` SELECT * FROM admin`;
    let [result] = await connection.query(sql);
    res.json(result);
  } catch (error) {
    console.error("ERROR in Fetching", error.message);
    res.status(500).send("Server Error");
  }
};

const signUp = async (req, res) => {
  let id = uuid();
  let { isAdmin, username, email, password, address, contact } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let found = await foundUser(username, email, contact);
    if (found) {
      return res.status(400).json({ message: "User Already Exist !" });
    }
    if (!isAdmin) {
      isAdmin = "users";
    }

    const sql = `INSERT INTO ${isAdmin} (id, username, email, password, address, contact)
VALUES (?, ?, ?, ?, ?, ?)`;

    await connection.query(sql, [
      id,
      username,
      email,
      hashedPassword,
      address,
      contact,
    ]);

    const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({
      success: true,
      message: "user registered Successfully",
      token,
      userId: id,
      isAdmin,
    });
  } catch (error) {
    console.error("ERROR in Sign up", error.message);
    res.status(500).send("Server Error");
  }
};

// const login = async (req, res) => {
//   const { isAdmin, email, password } = req.body;
//   try {
//     const sql = ` SELECT * FROM ${isAdmin} WHERE email = ? `;

//     connection.query(sql, email, async (err, result) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       if (result.length == 0) {
//         return res.status(404).json({ message: "Invalid Credentials!" });
//       }

//       const isMatch = await bcrypt.compare(password, result[0].password);
//       if (!isMatch) {
//         return res.status(404).json({ message: "Invalid Credentials!" });
//       }
//       const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET_KEY, {
//         expiresIn: "1h",
//       });
//       res.json({
//         success: true,
//         message: "User logged in succesfully",
//         token,
//         userId: result[0].id,
//         username: result[0].username,
//         isAdmin,
//       });
//     });
//   } catch (error) {
//     console.error("ERROR in login", error.message);
//     res.status(500).send("Server Error");
//   }
// };

const login = async (req, res) => {
  const { isAdmin, email, password } = req.body;

  try {
    // ✅ Whitelist table names (PREVENT SQL INJECTION)
    const table = isAdmin === "admin" ? "admin" : "users";

    const sql = `SELECT * FROM ${table} WHERE email = ?`;
    const [rows] = await connection.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: table },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      token,
      userId: user.id,
      username: user.username,
      isAdmin: table === "admin",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  const currentUser = req.params.id;
  try {
    let data = await findUser(currentUser);
    res.json(data[0]);
  } catch (error) {
    console.error("ERROR in user profile", error.message);
    res.status(500).send("Server Error");
  }
};

const updateUserProfile = async (req, res) => {
  const currentUserID = req.params.id;
  const { isAdmin, email, password, address, contact } = req.body;
  try {
    let updateField;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateField = hashedPassword;
    }
    const sql = `UPDATE ${isAdmin} SET email=?, password=?, address=?, contact=? WHERE id=?`;
    let [result] = await connection.query(sql, [
      email,
      updateField,
      address,
      contact,
      currentUserID,
    ]);
    if (result.changedRows == 0) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      res.json({ success: true, message: "User Updated Succesfully" });
    }
  } catch (error) {
    console.error("ERROR in user profile updating", error.message);
    res.status(500).send("Server Error");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentUserID = req.params.id;

  try {
    const deletecount = await deleteUser(currentUserID);

    if (deletecount == 0) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.json({ message: "User Deleted" });
  } catch (error) {
    console.error("ERROR in user profile deleting", error.message);
    res.status(500).send("Server Error");
  }
};

const getAdminAllBooks = async (req, res) => {
  try {
    let { id } = req.params;
    let sql = `SELECT b.*,a.username AS admin_username FROM book b JOIN admin a ON b.addby = a.id WHERE addby = ?`;
    let [result] = await connection.query(sql, id);
    res.json(result);
  } catch (error) {
    console.error("ERROR in user profile deleting", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
  deleteUserProfile,
  updateUserProfile,
  getUserProfile,
  getAllAdmin,
  getAdminAllBooks,
};
