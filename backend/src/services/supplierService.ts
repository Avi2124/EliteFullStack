import supplierRepository from "../repositories/supplierRepository.js";
import AppError from "../utils/AppError.js";
import type { CreateSupplierInput } from "../validators/supplierValidation.js";

class SupplierService {
  async create(data: CreateSupplierInput) {
    if (data.email) {
      const exists = await supplierRepository.findByEmail(data.email);
      if (exists) {
        throw new AppError("Supplier email already exists.", 409);
      }
    }
    const cleanData = {
      ...data,
      email: data.email ?? null,
      phone: data.phone ?? null,
    };
    return supplierRepository.create(cleanData);
  }

  async findAll() {
    return supplierRepository.findAll();
  }

  async findById(id: string) {
    const supplier = await supplierRepository.findById(id);
    if (!supplier) {
      throw new AppError("Supplier not found.", 404);
    }
    return supplier;
  }

  async update(id: string, data: Partial<CreateSupplierInput>) {
    await this.findById(id);
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
    return supplierRepository.update(id, cleanData);
  }

  async delete(id: string) {
    await this.findById(id);
    return supplierRepository.delete(id);
  }
}
export default new SupplierService();
