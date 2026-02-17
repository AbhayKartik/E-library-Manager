const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const genReport = async (req, res) => {
  let id = uuid();
  let adminId = req.params.id;
  let { reportType } = req.body;
  let today = new Date();
  let issueDate = today.toISOString().split("T")[0];

  try {
    let sql = `INSERT INTO reports ( ReportID,ReportType,GeneratedDate,AdminID) VALUES (?, ?, ?, ?)`;
    connection.query(
      sql,
      [id, reportType, issueDate, adminId],
      (err, result) => {
        if (err) {
          console.log("err in report insert ", err);
        }
        res.json({ message: "Report Genrated" });
      },
    );
  } catch (error) {
    console.error("Error in report ", error);
  }
};
const getReportById = async (req, res) => {
  try {
    let id = req.params.id;

    let sql = ` SELECT * FROM reports WHERE AdminID = ?`;
    connection.query(sql, id, (err, result) => {
      if (err) {
        console.log("Error in getinng reports", err);
      }
      res.json(result);
    });
  } catch (error) {
    console.error("Error in report ", error);
  }
};

module.exports = {
  genReport,
  getReportById,
};
