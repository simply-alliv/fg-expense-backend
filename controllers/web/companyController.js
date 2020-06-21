const Company = require("../../models/companies");
const Expenses = require("../../models/expense");
const apiresponse = require("../../utility/apiResponse");
/* eslint-disable */
const pattern = /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9-_]+)/;
/* eslint-enable */
exports.createCompany = async (req, res) => {
  try {
    let { name, twitter_handle, head, head_handle } = req.body;
    name = name.toLowerCase();
    /* eslint-enable */
    let company = new Company({ name, twitter_handle, head, head_handle });
    const test_company = await Company.findOne({ name: name });
    if (test_company) {
      //Error message
      res.status(400).send({
        status: false,
        message:
          "Error in creating this Company. " +
          name +
          " exists in the database.",
      });
    } else if (
      //test for twitter_handle
      (!pattern.test(twitter_handle) && twitter_handle != "") ||
      (!pattern.test(head_handle) && head_handle != "")
    ) {
      //Error message
      res.status(400).send({
        status: false,
        message:
          "Error in creating this Company. Ensure Twitter handles are written correctly.",
      });
    } else {
      await company.save();
    }
  } catch (error) {
    console.log(error.name, error.message);
    res.status(400).send({
      status: false,
      message: error.name,
      desc: error.message,
    });
  }
};

exports.getAllCompanies = (req, res) => {
  const allCompanyQuery = Company.find();

  allCompanyQuery.exec((err, companies) => {
    if (err) {
      return apiresponse.ErrorResponse(res, "Something went wrong");
    }
    return apiresponse.successResponseWithData(res, companies);
  });
};

exports.getCompany = (req, res) => {
  const companyId = req.params.id;
  Company.find(companyId)
    .populate("Head")
    .populate("Project")
    .then((companyProfile) => {
      res.json(companyProfile);
    });
};
exports.getCompanies = (req, res, next) => {
  Company.find()
    .then((companies) => {
      res.send(companies);
    })
    .catch(next);
};

exports.searchCompany = (req, res) => {
  const { q } = req.params;
  if (q && q.trim() !== "") {
    const reqexQ = new RegExp(q, "i");
    Company.find(
      { $or: [{ name: reqexQ }, { twitter_handle: reqexQ }] },
      "name",
      (err, d) => {
        if (d && err === null && d.status !== 3) {
          return apiresponse.successResponseWithData(res, "success", d);
        } else {
          return apiresponse.ErrorResponse(res, "Opps!");
        }
      }
    );
  }
};

exports.getCompanyFunds = (req, res, next) => {
  Expenses.find({})
    .populate("mdas")
    .populate("companies")
    .then((expenses) => {
      let expense = {};
      let result = [];
      expenses.forEach((exp) => {
        expense.mda = exp.mdas.name;
        expense.mdaHandle = exp.mdas.twitter_handle;
        expense.companyName = exp.companies.name;
        expense.companyHandle = exp.companies.twitter_handle;
        expense.companyHead = exp.companies.head;
        expense.companyHeadHandle = exp.companies.head_handle;
        expense.project = exp.expenseDesc;
        expense.projectAmt = parseInt(exp.expenseAmount);
        expense.paymentDate = exp.paymentDate;
        result.push(expense);
      });
      res.status(200).json({
        status: "success",
        message: "All Companies and Funds Received",
        data: { result },
      });
    })
    .catch(next);
};
