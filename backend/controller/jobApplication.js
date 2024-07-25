const express = require("express");
const { sendResponse } = require("../helper");
const JobApplicationModel = require("../model/jobapplication");
const jwt = require("jsonwebtoken");

const jobApplicationRouter = express.Router();

async function decodeUserId(res, token) {
	try {
		console.log(token);
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		return decoded.user_id;
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
}

jobApplicationRouter.get("/", async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			return sendResponse(res, "Provide token", 400);
		}
		const user_uid = await decodeUserId(res, token);
		const jobApplications = await JobApplicationModel.find({ user: user_uid });

		return sendResponse(res, jobApplications);
	} catch (error) {
		return sendResponse(res, error.message, 500);
	}
});

jobApplicationRouter.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const token = req.headers.authorization;
		if (!token) {
			return sendResponse(res, "Provide token", 400);
		}
		const user_uid = await decodeUserId(res, token);

		const jobApplication = await JobApplicationModel.findById(id);
		if (jobApplication.user != user_uid) {
			return sendResponse(
				res,
				"You are not authorized to access this resource",
				401
			);
		}
		console.log(jobApplication);

		if (!jobApplication) {
			return sendResponse(res, "Job Application not found", 404);
		}

		return sendResponse(res, jobApplication);
	} catch (error) {
		return sendResponse(res, error.message, 500);
	}
});

jobApplicationRouter.post("/", async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			return sendResponse(res, "Provide token", 400);
		}
		const user_uid = await decodeUserId(res, token);

		const companyData = req.body;
		const jobApplication = await JobApplicationModel.create({
			...companyData,
			user: user_uid,
		});

		return sendResponse(res, jobApplication);
	} catch (error) {
		if (error.name === "ValidationError") {
			return sendResponse(res, error.message, 400);
		}
		return sendResponse(res, error.message, 500);
	}
});

jobApplicationRouter.patch("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const companyData = req.body;

		const token = req.headers.authorization;
		if (!token) {
			return sendResponse(res, "Provide token", 400);
		}

		console.log(id);

		const user_uid = await decodeUserId(res, token);

		const jobApplication = await JobApplicationModel.findById(id);

		if (!jobApplication) {
			return sendResponse(res, "Job Application not found", 404);
		}

		if (jobApplication.user != user_uid) {
			return sendResponse(
				res,
				"You are not authorized to update this resource",
				401
			);
		}

		const updatedJobApplication = await JobApplicationModel.findByIdAndUpdate(
			id,
			companyData,
			{ new: true, runValidators: true }
		);

		return sendResponse(res, updatedJobApplication);
	} catch (error) {
		console.log(error);
		if (error.name === "ValidationError") {
			return sendResponse(res, error.message, 400);
		}
		return sendResponse(res, error.message, 500);
	}
});

jobApplicationRouter.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;

		const token = req.headers.authorization;
		if (!token) {
			return sendResponse(res, "Provide token", 400);
		}

		const user_uid = await decodeUserId(res, token);

		const jobApplication = await JobApplicationModel.findById(id);

		if (!jobApplication) {
			return sendResponse(res, "Job Application not found", 404);
		}

		if (jobApplication.user.toString() != user_uid) {
			return sendResponse(
				res,
				"You are not authorized to delete this resource",
				401
			);
		}

		await JobApplicationModel.findByIdAndDelete(id);

		return sendResponse(res, "Job Application deleted successfully");
	} catch (error) {
		return sendResponse(res, error.message, 500);
	}
});

module.exports = jobApplicationRouter;
