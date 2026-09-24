// import transporter from "../config/mail.js";
// import categoryRepository from "../repositories/categoryRepository.js";
// import productRepository from "../repositories/productRepository.js";
// import supplierRepository from "../repositories/supplierRepository.js";
// import { saveProductExcel } from "../utils/excel.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import fs from "fs/promises";

// class EmailService {
//   async sendTestEmail(to: string) {
//     await sendEmail({
//       to,
//       subject: "Test Email from Elite Inventory API",
//       html: `
//             <h2>Email sent successfully</h2>
//             <p>This email confirms that Nodemailer is configured correctly.</p>
//             <hr>
//             <p><strong>Project:</strong> Elite Inventory API</p>
//             <p><strong>Status:</strong> Working</p>
//             `,
//     });
//   }

//   async sendLowerStockAlert(to: string) {
//     const products = await productRepository.findLowStockProducts();
//     if (products.length === 0) {
//       return;
//     }
//     const rows = products
//       .map(
//         (product) => `
//             <tr>
//                 <td>${product.name}</td>
//                 <td>${product.sku}</td>
//                 <td>${product.quantity}</td>
//                 <td>${product.minStock}</td>
//             </tr>
//         `,
//       )
//       .join("");
//     await sendEmail({
//       to,
//       subject: "Low Stock Alert",
//       html: `
//                 <h2>Low Stock Products</h2>
//                 <p>The following products need to be restocked:</p>
//                 <table border="1" cellpadding="8" celspacing="0">
//                     <tr>
//                         <th>Product</th>
//                         <th>SKU</th>
//                         <th>Quantity</th>
//                         <th>Minimum Stock</th>
//                     </tr>
//                     ${rows}
//                     </table>
//                     <br>
//                     <b>Elite Inventory API</b>
//             `,
//     });
//   }

//   async sendDailyInventorySummary(to: string) {
//     const totalProducts = await productRepository.countProducts();
//     const totalCategories = await categoryRepository.count();
//     const totalQuantity = await productRepository.totalInventoryQuantity();
//     const totalSuppliers = await supplierRepository.count();
//     const lowStockProducts = await productRepository.getLowStockProducts();
//     const rows = lowStockProducts
//       .map(
//         (product) => `
//     <tr>
//         <td>${product.name}</td>
//         <td>${product.sku}</td>
//         <td>${product.category.name}</td>
//         <td>${product.supplier.name}</td>
//         <td>${product.quantity}</td>
//         <td>${product.minStock}</td>
//     </tr>
//     `,
//       )
//       .join("");
//     await sendEmail({
//       to,
//       subject: "Daily Inventory Summary",
//       html: `
//             <h2>Daily Inventory Summary</h2>
//             <hr>
//             <p><strong>Total Products:</strong> ${totalProducts}</p>
//             <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
//             <p><strong>Total Categories:</strong> ${totalCategories}</p>
//             <p><strong>Total Suppliers:</strong> ${totalSuppliers}</p>
//             <p><strong>Low Stock Products:</strong> ${lowStockProducts.length}</p>
//             <br>
//             <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
//                 <tr>
//                     <th>Product</th>
//                     <th>SKU</th>
//                     <th>Category</th> 
//                     <th>Supplier</th>
//                     <th>Quantity</th>
//                     <th>Min Stock</th>
//                 </tr>
//                 ${rows}
//             </table>
//             <br>
//             <p>This email was generated automatically by <strong>Elite Inventory API</strong>.</p>
//         `,
//     });
//   }

//   async sendWeeklyInventoryReport(to: string) {
//     const products = await productRepository.exportProducts();
//     const filePath = await saveProductExcel(products);
//     await transporter.sendMail ({
//         from: process.env.MAIL_FROM,
//         to,
//         subject: "Weekly Inventory Report",
//         html: `
//             <h2>Weekly Inventory Report</h2>
//             <p>Hello Admin,</p>
//             <p><strong>Elite Inventory API</strong></p>
//         `,
//         attachments: [
//             {
//                 filename: "Weekly-Inventory-Report.xlsx",
//                 path: filePath,
//             }
//         ]
//     });
//     await fs.unlink(filePath);
//   }
// }
// export default new EmailService();

import transporter from "../config/mail.js";

import categoryRepository from "../repositories/categoryRepository.js";
import productRepository from "../repositories/productRepository.js";
import supplierRepository from "../repositories/supplierRepository.js";

import { saveProductExcel } from "../utils/excel.js";
import { sendEmail } from "../utils/sendEmail.js";

import fs from "fs/promises";

class EmailService {
  /**
   * Get admin email from backend environment variables.
   */
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
    const totalQuantity =
      await productRepository.totalInventoryQuantity();
    const totalSuppliers = await supplierRepository.count();

    const lowStockProducts =
      await productRepository.getLowStockProducts();

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
}

export default new EmailService();
