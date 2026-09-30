import transporter from "../config/mail.js";

import categoryRepository from "../repositories/categoryRepository.js";
import productRepository from "../repositories/productRepository.js";
import supplierRepository from "../repositories/supplierRepository.js";

import { saveProductExcel } from "../utils/excel.js";
import { sendEmail } from "../utils/sendEmail.js";

import fs from "fs/promises";

class EmailService {
  private getAdminEmail(): string {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error("ADMIN_EMAIL is not configured.");
    }

    return email;
  }

  async sendTestEmail(to: string) {
    await sendEmail({
      to,
      subject: "Test Email from Elite Inventory API",
      html: `
        <h2>Email sent successfully</h2>
        <p>This email confirms that Nodemailer is configured correctly.</p>
        <hr>
        <p><strong>Project:</strong> Elite Inventory API</p>
        <p><strong>Status:</strong> Working</p>
      `,
    });
  }

  async sendLowerStockAlert() {
    const to = this.getAdminEmail();

    const products = await productRepository.findLowStockProducts();

    if (products.length === 0) {
      return;
    }

    const rows = products
      .map(
        (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${product.quantity}</td>
            <td>${product.minStock}</td>
          </tr>
        `,
      )
      .join("");

    await sendEmail({
      to,
      subject: "Low Stock Alert",
      html: `
        <h2>Low Stock Products</h2>

        <p>The following products need to be restocked:</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Minimum Stock</th>
          </tr>

          ${rows}
        </table>

        <br>

        <b>Elite Inventory API</b>
      `,
    });
  }

  async sendDailyInventorySummary() {
    const to = this.getAdminEmail();

    const totalProducts = await productRepository.countProducts();
    const totalCategories = await categoryRepository.count();
    const totalQuantity = await productRepository.totalInventoryQuantity();
    const totalSuppliers = await supplierRepository.count();

    const lowStockProducts = await productRepository.getLowStockProducts();

    const rows = lowStockProducts
      .map(
        (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${product.category.name}</td>
            <td>${product.supplier.name}</td>
            <td>${product.quantity}</td>
            <td>${product.minStock}</td>
          </tr>
        `,
      )
      .join("");

    await sendEmail({
      to,
      subject: "Daily Inventory Summary",
      html: `
        <h2>Daily Inventory Summary</h2>

        <hr>

        <p>
          <strong>Total Products:</strong>
          ${totalProducts}
        </p>

        <p>
          <strong>Total Quantity:</strong>
          ${totalQuantity}
        </p>

        <p>
          <strong>Total Categories:</strong>
          ${totalCategories}
        </p>

        <p>
          <strong>Total Suppliers:</strong>
          ${totalSuppliers}
        </p>

        <p>
          <strong>Low Stock Products:</strong>
          ${lowStockProducts.length}
        </p>

        <br>

        <table
          border="1"
          cellpadding="8"
          cellspacing="0"
          style="border-collapse: collapse;"
        >
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Min Stock</th>
          </tr>

          ${rows}
        </table>

        <br>

        <p>
          This email was generated automatically by
          <strong>Elite Inventory API</strong>.
        </p>
      `,
    });
  }

  async sendWeeklyInventoryReport() {
    const to = this.getAdminEmail();

    const products = await productRepository.exportProducts();

    const filePath = await saveProductExcel(products);

    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Weekly Inventory Report",
        html: `
          <h2>Weekly Inventory Report</h2>

          <p>Hello Admin,</p>

          <p>
            <strong>Elite Inventory API</strong>
          </p>
        `,
        attachments: [
          {
            filename: "Weekly-Inventory-Report.xlsx",
            path: filePath,
          },
        ],
      });
    } finally {
      await fs.unlink(filePath).catch(() => {});
    }
  }

  async sendResetPasswordEmail(to: string, name: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    await sendEmail({
      to,
      subject: "Reset Your Elite Inventory Password.",
      html: `<h2>Password Reset Request</h2>
           <p>Hello ${name},</p>
           <p>
               We received a request to reset your
               Elite Inventory password.
           </p>
            <p>
                Click the button below to create a new password:
            </p>
            <p>
                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:10px 18px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>
            </p>
            <p>
                This link will expire in <strong>10 minutes</strong>.
            </p>
            <p>
                If you did not request a password reset,
                you can safely ignore this email.
            </p>
            <br>
            <p>
                <strong>Elite Inventory</strong>
            </p>
        `,
    });
  }
}

export default new EmailService();