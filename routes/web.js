const express = require("express");
const router = express.Router();

//require all web controllers
const projectsController = require("../controllers/web/projectsController");
const paymentReportController = require("../controllers/web/paymentReportController");
const mdaController = require("../controllers/web/mdaController");
const companyController = require("../controllers/web/companyController");
const expenseController = require("../controllers/web/expenseController");
const sectorController = require("../controllers/web/sectorController");
const SubscriberController = require("../controllers/SubscriberController");

/**
 * add routes for projects controller directly under here
 */
router.post("/projects/create", projectsController.createProject);
router.get("/projects", projectsController.getAllProjects);
//router.get("/projects/:id", projectsController.singleProject);

// Returns monthly  total agregated payments by all MDAs
router.get(
  "/total-monthly-payments/",
  expenseController.getTotalMonthlyExpenses
);

// Returns filtered expenses of MDAs by year and months
router.get(
  "/expenses/:year/:month",
  expenseController.getExpensesByYearAndMonth
);

/**
 * add routes for payementReportController directly under here
 */
router.get("/reports/sort/:fkey?/:skey?", paymentReportController.sortReport);
router.post("/reports/create", paymentReportController.createPaymentReport);
router.get("/reports", paymentReportController.getAllReports);
//router.get("/report/:id", paymentReportController.getReport);
//router.get("/report/download", paymentReportController.downloadReport);

/**
 * Routes for newsletter service
 */
router
  .route("/subscribers")
  .get(SubscriberController.getAllSubscribers())
  .post(
    SubscriberController.subscribeRouteValidation(),
    SubscriberController.subscribe()
  );
router.route("/subscribers/:id").delete(SubscriberController.unSubscribe());

/**
 * add routes for sectorController directly under here
 */
//router.get("/sectors/all", sectorController.getAllSectors);
router.get("/sectors/:id", sectorController.getASector);

/**
 * add routes for companyController directly under here
 */
router.get("/companies", companyController.getAllCompanies);
router.post("/companies/create", companyController.createCompany);

// search for company
router.get("/companies/search/:q", companyController.searchCompany);

//get all company funds and project awarded
router.get("/companies/funds", companyController.getCompanyFunds);

//router.get("/companies/:id", companyController.getAcompany);

/**
 * add routes for mdaController directly under here
 */
router.post("/mdas/create", mdaController.createMda);
router.get("/mdas", mdaController.getAllMdas);
router.get("/mdas/:mdaId", mdaController.getMda);
router.get("/mda/heads", mdaController.getAllHeads);

/**
 * add routes for expensesController directly under here
 */

router.get("/expenses", expenseController.getExpenses);

router.get("/expenses/:id", expenseController.getSingleExpense);
router.post("/expenses/create", expenseController.createExpenses);

//index route redirecting to the main FE home page
router.get("/", (req, res) => {
  res.redirect("http://expenseng.com", 301);
});

module.exports = router;
