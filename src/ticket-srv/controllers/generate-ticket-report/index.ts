/**
 * generateTicketReport.ts defines the logic for generating and exporting a ticket report.
 * It fetches closed tickets from the last one month and exports them in either CSV or PDF format.
 *
 * @param req - Express request object
 * @param res - Express response object
 */

// Import necessary modules
import { Request, Response } from "express";
import { Ticket } from "../../models";
import json2csv from "json2csv";
import pdfkit from "pdfkit";
import fs from "fs";
import { BadRequestError, NotFoundError } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

// Define the controller function for generating and exporting a ticket report
export const generateTicketReport = async (req: Request, res: Response) => {
  try {
    // Fetch all closed tickets in the last one month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const closedTickets = await Ticket.find({
      status: "closed",
      closedAt: { $gte: oneMonthAgo },
    });

    // Check if there are closed tickets
    if (closedTickets.length === 0) {
      throw new NotFoundError("No closed tickets found in the last one month.");
    }

    // Convert tickets to the desired format (CSV or PDF)
    let reportData;
    let contentType;

    if (req.query.format === "csv") {
      reportData = json2csv.parse(closedTickets, {
        fields: ["subject", "description", "closedAt"],
      });
      contentType = "text/csv";
    } else if (req.query.format === "pdf") {
      const pdfDoc = new pdfkit();
      pdfDoc.pipe(fs.createWriteStream("report.pdf"));

      closedTickets.forEach((ticket: any) => {
        pdfDoc.text(`Subject: ${ticket.subject}`);
        pdfDoc.text(`Description: ${ticket.description}`);
        pdfDoc.text(`Closed At: ${ticket.closedAt}`);
        pdfDoc.text("-----------------------");
      });

      pdfDoc.end();

      reportData = fs.readFileSync("report.pdf");
      contentType = "application/pdf";
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid format specified. Use "csv" or "pdf".' });
    }

    // Set the appropriate headers for download
    res.setHeader(
      "Content-disposition",
      `attachment; filename=ticket_report.${req.query.format}`
    );
    res.setHeader("Content-type", contentType);

    // Send the report data
    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket report generated successfully",
      data: reportData,
    });

    // Send a 200 status with the response
    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    // Handle any errors and return a 500 response for internal server error
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};
