import { Router } from "express";
import { accountController } from "./account.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AccountValidations } from "./account.validation";

const router = Router();

// Create new account (authenticated user)
router.post(
  "/",
  auth(), // any logged-in user
//   validateRequest(AccountValidations.createAccountSchema),
  accountController.createAccount
);

// Get all accounts for the logged-in user
router.get("/", auth(), accountController.getMyAccounts);

// Get single account by ID (only if belongs to user)
router.get("/:id", auth(), accountController.getAccountById);

// Update account (only own accounts)
router.patch(
  "/:id",
  auth(),
//   validateRequest(AccountValidations.updateAccountSchema),
  accountController.updateAccount
);

// Delete account (soft or hard — here we do hard delete for simplicity)
router.delete("/:id", auth(), accountController.deleteAccount);

export const AccountRoutes = router;