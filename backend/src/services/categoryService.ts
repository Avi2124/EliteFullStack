import categoryRepository from "../repositories/categoryRepository.js";
import AppError from "../utils/AppError.js";
import type { CreateCategoryInput } from "../validators/categoryValidation.js";

class CategoryService {
  async create(data: CreateCategoryInput) {
    const exists = await categoryRepository.findByName(data.name);
    if (exists) {
      throw new AppError("Category already exists.", 409);
    }
    return categoryRepository.create(data);
  }

  async findAll() {
    return await categoryRepository.findAll();
  }

  async findById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found.", 404);
    }
    return category;
  }

  async update(id: string, data: CreateCategoryInput) {
    await this.findById(id);

    return await categoryRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    return await categoryRepository.delete(id);
  }
}
export default new CategoryService();
