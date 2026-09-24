import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidation.js";
import productService from "../services/productService.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";

class ProductController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = createProductSchema.parse(req.body);
    const product = await productService.create(data, req.user!.id);
    return sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Product created successfully.",
      data: product,
    });
  });

  findAll = asyncHandler(async (req, res) => {
    const result = await productService.findAll(req.query);
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Products fetched successfully.",
      data: result,
    });
  });

  findById = asyncHandler(async (req, res) => {
    const product = await productService.findById(req.params.id as string);
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product fetched successfully.",
      data: product,
    });
  });

  update = asyncHandler(async (req, res) => {
    const data = updateProductSchema.parse(req.body);

    const product = await productService.update(
      req.params.id as string,
      data,
      req.user!.id,
    );

    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product updated successfully.",
      data: product,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new AppError("Invalid product ID.", 400);
    }

    await productService.delete(id, req.user!.id);
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product deleted successfully.",
    });
  });

  exportProducts = asyncHandler(async (req, res) => {
    const workbook = await productService.exportProducts();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="products.xlsx"',
    );
    await workbook.xlsx.write(res);
    return res.end();
  });

  importProducts = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError("Excel file is required.", 400);
    }
    const result = await productService.importProducts(req.file.path);
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Products imported successfully.",
      data: result,
    });
  });

  downloadTemplate = asyncHandler(async (req, res) => {
    const workbook = await productService.downloadTemplate();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename = "product-template.xlsx"',
    );
    await workbook.xlsx.write(res);
    return res.end();
  });
}
export default new ProductController();
