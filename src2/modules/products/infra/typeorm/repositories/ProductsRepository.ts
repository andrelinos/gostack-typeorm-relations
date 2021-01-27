import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProductByName = await this.ormRepository.findOne({
      where: { name },
    });

    return findProductByName;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids: string[] = [];

    products.map(product => ids.push(product.id));

    /* const findProducts = await this.ormRepository.findByIds(ids); */
    const findProducts = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsArray: Product[] = [];

    products.map(async product => {
      const findedProduct = await this.ormRepository.findOne(product.id);

      if (findedProduct) {
        findedProduct.quantity -= product.quantity;

        const updatedProduct = await this.ormRepository.save(findedProduct);

        productsArray.push(updatedProduct);
      }
    });

    return productsArray;
  }
}

export default ProductsRepository;
