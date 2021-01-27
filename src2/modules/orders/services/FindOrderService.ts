import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order> {
    const findOrder = await this.ordersRepository.findById(id);

    if (!findOrder) {
      throw new AppError('Order not found');
    }

    return findOrder;
  }
}

export default FindOrderService;
